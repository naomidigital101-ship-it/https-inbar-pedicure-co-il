-- ============================================================================
-- מערכת ניהול תוכן לבעלת העסק
--
-- מעביר את התוכן שהיה קשיח בקוד (site-config.ts, services-content.ts,
-- categories.ts) לדאטאבייס, כדי שענבר תוכל לערוך אותו מהאדמין.
--
-- הכל idempotent ותוספתי בלבד: create if not exists / upsert.
-- אין drop של טבלה ואין מחיקת שורות.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- תשתית משותפת
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- user_roles.role הוא enum app_role, ולכן ההשוואה עוברת דרך ::text.
-- SECURITY DEFINER מונע רקורסיה כשמדיניות RLS על טבלה אחרת בודקת תפקיד.
create or replace function public.has_role(_user_id uuid, _role text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role::text = _role
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin');
$$;

-- ----------------------------------------------------------------------------
-- site_settings — פרטי עסק, טקסטי דף הבית, באנר, SEO.
-- טבלה מונחית-נתונים: כל שורה נושאת את התווית העברית וסוג השדה,
-- כך שטופס האדמין נבנה מהנתונים ואפשר להוסיף שדה בלי לגעת ב-UI.
-- ----------------------------------------------------------------------------

create table if not exists public.site_settings (
  key         text primary key,
  value       text,
  group_key   text not null default 'general',
  label       text not null,
  input_type  text not null default 'text',
  help_text   text,
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings for select using (true);
drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write" on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- services — 7 עמודי הטיפולים, התוכן המרכזי של האתר.
-- השדות העשירים ב-jsonb כדי שהעורך הוויזואלי יבנה סקשנים
-- (כותרת / פסקה / בוליטים / טבלה / "מהקליניקה" / הפניות למקורות).
-- ----------------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nav_label text not null,
  title text not null,
  subtitle text,
  meta_title text,
  meta_description text,
  h1 text,
  canonical text,
  og_image text,
  noindex boolean not null default false,
  tldr text,
  intro text,
  quick_facts jsonb not null default '[]'::jsonb,
  sections    jsonb not null default '[]'::jsonb,
  red_flags   jsonb not null default '[]'::jsonb,
  faqs        jsonb not null default '[]'::jsonb,
  sources     jsonb not null default '[]'::jsonb,
  hero_image text,
  card_image text,
  card_alt text,
  price_text text,
  price_visible boolean not null default false,
  -- כרטיסי "תחומי הליבה" בדף הבית נשלפים מכאן — מקור אמת אחד
  is_flagship boolean not null default false,
  flagship_title text,
  flagship_tag text,
  flagship_sub text,
  flagship_icon text,
  flagship_accent text,
  schema_type text not null default 'MedicalWebPage',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.services add column if not exists flagship_title text;
create index if not exists services_published_idx on public.services (is_published, sort_order);
create index if not exists services_flagship_idx on public.services (is_flagship, sort_order) where is_flagship;
alter table public.services enable row level security;
drop policy if exists "services public read published" on public.services;
create policy "services public read published" on public.services for select using (is_published = true);
drop policy if exists "services admin all" on public.services;
create policy "services admin all" on public.services for all
  using (public.is_admin()) with check (public.is_admin());
drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- knowledge_categories — 6 קטגוריות מרכז הידע
-- ----------------------------------------------------------------------------

create table if not exists public.knowledge_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  title text,
  description text,
  meta_title text,
  meta_description text,
  hero_image text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.knowledge_categories add column if not exists short_name text;
alter table public.knowledge_categories add column if not exists mod_code text;
alter table public.knowledge_categories enable row level security;
drop policy if exists "categories public read" on public.knowledge_categories;
create policy "categories public read" on public.knowledge_categories for select using (is_published = true);
drop policy if exists "categories admin all" on public.knowledge_categories;
create policy "categories admin all" on public.knowledge_categories for all
  using (public.is_admin()) with check (public.is_admin());
drop trigger if exists knowledge_categories_updated_at on public.knowledge_categories;
create trigger knowledge_categories_updated_at before update on public.knowledge_categories
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- reviews — המלצות לקוחות, מזינות AggregateRating
-- ----------------------------------------------------------------------------

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_area text,
  rating int not null default 5 check (rating between 1 and 5),
  body text not null,
  service_slug text,
  source text not null default 'manual',
  source_url text,
  review_date date not null default current_date,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists reviews_published_idx on public.reviews (is_published, sort_order, review_date desc);
alter table public.reviews enable row level security;
drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews for select using (is_published = true);
drop policy if exists "reviews admin all" on public.reviews;
create policy "reviews admin all" on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());
drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- before_after — גלריית לפני/אחרי.
-- consent_confirmed הוא שער חובה ברמת הדאטאבייס: אלה תמונות רפואיות
-- של מטופלות אמיתיות, ואכיפה ב-UI בלבד אינה מספיקה.
-- ----------------------------------------------------------------------------

create table if not exists public.before_after (
  id uuid primary key default gen_random_uuid(),
  service_slug text,
  title text not null,
  description text,
  before_image text not null,
  before_alt text,
  after_image text not null,
  after_alt text,
  sessions_count int,
  timeframe text,
  consent_confirmed boolean not null default false,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint before_after_consent_required
    check (is_published = false or consent_confirmed = true)
);
create index if not exists before_after_published_idx on public.before_after (is_published, sort_order);
alter table public.before_after enable row level security;
drop policy if exists "before_after public read" on public.before_after;
create policy "before_after public read" on public.before_after for select
  using (is_published = true and consent_confirmed = true);
drop policy if exists "before_after admin all" on public.before_after;
create policy "before_after admin all" on public.before_after for all
  using (public.is_admin()) with check (public.is_admin());
drop trigger if exists before_after_updated_at on public.before_after;
create trigger before_after_updated_at before update on public.before_after
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- media — אינדקס לתמונות שהועלו, כדי שיהיה בורר תמונות באדמין
-- ----------------------------------------------------------------------------

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text unique not null,
  url text not null,
  alt text,
  title text,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  folder text not null default 'general',
  created_at timestamptz not null default now()
);
create index if not exists media_folder_idx on public.media (folder, created_at desc);
alter table public.media enable row level security;
drop policy if exists "media public read" on public.media;
create policy "media public read" on public.media for select using (true);
drop policy if exists "media admin all" on public.media;
create policy "media admin all" on public.media for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- leads — הרחבה לטופס יצירת קשר אמיתי (שם, טלפון, הודעה, מעקב סטטוס)
-- ----------------------------------------------------------------------------

alter table public.leads add column if not exists name         text;
alter table public.leads add column if not exists phone        text;
alter table public.leads add column if not exists message      text;
alter table public.leads add column if not exists service_slug text;
alter table public.leads add column if not exists status       text not null default 'new';
alter table public.leads add column if not exists notes        text;
alter table public.leads add column if not exists handled_at   timestamptz;

-- email היה unique — חסם לקוחה שפונה פעמיים. וכעת גם אופציונלי,
-- כי פנייה טלפונית לא תמיד כוללת אימייל.
do $$
declare c text;
begin
  select conname into c from pg_constraint
  where conrelid = 'public.leads'::regclass and contype = 'u'
    and pg_get_constraintdef(oid) ilike '%(email)%';
  if c is not null then execute format('alter table public.leads drop constraint %I', c); end if;
end $$;
alter table public.leads alter column email drop not null;
create index if not exists leads_status_idx on public.leads (status, created_at desc);

-- ----------------------------------------------------------------------------
-- Storage — באקט ציבורי לתמונות האתר
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public) values ('site-media','site-media',true)
on conflict (id) do update set public = true;

drop policy if exists "site-media public read" on storage.objects;
create policy "site-media public read" on storage.objects for select
  using (bucket_id = 'site-media');
drop policy if exists "site-media admin write" on storage.objects;
create policy "site-media admin write" on storage.objects for all
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

-- ----------------------------------------------------------------------------
-- זריעה — הערכים הם בדיוק מה שהיה קשיח בקוד ערב המעבר.
-- ה-upsert מעדכן תווית/סוג/קבוצה בלבד; value לא נדרס אחרי עריכה באדמין.
-- ----------------------------------------------------------------------------

insert into public.site_settings (key, value, group_key, label, input_type, help_text, sort_order) values
  ('phone_display','050-666-8595','contact','טלפון לתצוגה','tel','איך המספר מוצג באתר',10),
  ('phone_intl','+972506668595','contact','טלפון בפורמט בינלאומי','tel','משמש לקישור החיוג ולסכמה',20),
  ('whatsapp_number','972506668595','contact','מספר וואטסאפ','text','ספרות בלבד, בלי + ובלי מקפים',30),
  ('whatsapp_default_message','שלום ענבר, אשמח לתאם טיפול','contact','הודעת וואטסאפ מוכנה','text','הטקסט שנפתח אוטומטית בוואטסאפ',35),
  ('email','inbar.pedicure@gmail.com','contact','אימייל','email',null,40),
  ('city','בית אל','contact','יישוב','text',null,50),
  ('region','אזור בנימין','contact','אזור','text',null,60),
  ('waze_url','https://waze.com/ul?q=ענבר%20פרחי%20פדיקור%20טיפולי%20בית%20אל','contact','קישור Waze','url',null,70),
  ('hours_display','ראשון–חמישי, 09:00–20:00','contact','שעות פעילות לתצוגה','text','הטקסט שמופיע באתר',80),

  ('brand','ענבר פרחי','business','שם העסק','text',null,10),
  ('tagline','פדיקוריסטית טיפולית לטיפול בכף הרגל','business','שורת תיאור','text',null,20),
  ('short_description','פדיקור טיפולי לטיפול ביבלות, פטרת, ציפורן חודרנית וסדקים בעקב. גישה סטרילית, עדינה ומבוססת ניסיון.','business','תיאור קצר','textarea','משמש גם כתיאור מטא בדף הבית',30),
  ('years_experience','12','business','שנות ניסיון','number','מופיע בהירו ובעמוד אודות',40),
  ('treatments_count','200+','business','מספר טיפולים','text',null,50),

  ('banner_enabled','false','banner','הצגת באנר','boolean','מדליק ומכבה את הפס העליון באתר',10),
  ('banner_text','','banner','טקסט הבאנר','text','לדוגמה: בחופשה עד 20.8 · תורים פנויים השבוע',20),
  ('banner_link','','banner','קישור מהבאנר','url','אופציונלי',30),

  ('home_hero_kicker','מטפלת · מרצה · מכשירה פדיקוריסטיות','homepage','שורה עליונה בהירו','text',null,10),
  ('home_hero_title','הליכה בלי כאב מתחילה כאן','homepage','כותרת ראשית (H1)','text',null,20),
  ('home_hero_subtitle','הקליניקה של ענבר פרחי לפדיקור טיפולי — מרצה ומכשירה פדיקוריסטיות בכל הארץ','homepage','תת-כותרת','textarea',null,30),
  ('home_hero_lede','12+ שנות ניסיון קליני, אבחון מדויק וטיפול סטרילי — ומאות מטופלים שחזרו ללכת בלי כאב.','homepage','פסקת פתיחה','textarea',null,40),
  ('home_hero_cta_primary','לתיאום טיפול בקליניקה','homepage','כפתור ראשי','text',null,50),
  ('home_hero_cta_secondary','אני פדיקוריסטית — להכשרות','homepage','כפתור משני','text',null,60),
  ('home_hero_stats','[{"num":"12+","label":"שנות ניסיון קליני"},{"num":"200+","label":"מטופלים בשנה"},{"num":"20+","label":"פדיקוריסטיות הוכשרו"},{"num":"150+","label":"שעות השתלמות בשנה"}]','homepage','ארבעת המספרים בהירו','repeater','כל פריט: מספר + תיאור',70),
  ('home_hero_image','','homepage','תמונת הירו','image','ריק = התמונה הקיימת בקוד',80),
  ('home_flagship_kicker','תחומי הליבה','homepage','שורה עליונה — תחומי ליבה','text',null,90),
  ('home_flagship_title','שלושה תחומים שאני מתמחה בהם','homepage','כותרת — תחומי ליבה','text',null,100),

  ('site_url','https://inbar-pedicure.co.il','seo','כתובת האתר','url','מקור אמת יחיד לקנוניקל, סייטמאפ ו-og:url',10),
  ('default_og_image','','seo','תמונת שיתוף ברירת מחדל','image',null,20)
on conflict (key) do update set
  group_key  = excluded.group_key,
  label      = excluded.label,
  input_type = excluded.input_type,
  help_text  = excluded.help_text,
  sort_order = excluded.sort_order;

insert into public.knowledge_categories (slug, label, title, short_name, mod_code, sort_order) values
  ('foot-care',    'טיפוח כף הרגל',      'טיפוח כף הרגל',      'טיפוח יומי', '[ MOD: 01 // CARE ]',  10),
  ('conditions',   'בעיות נפוצות',       'בעיות ומחלות נפוצות','אבחון וטיפול','[ MOD: 02 // DIAG ]',  20),
  ('diabetic-foot','כף רגל סוכרתית',     'כף רגל סוכרתית',     'סוכרת',      '[ MOD: 03 // DM ]',    30),
  ('treatments',   'טיפולים ופרוצדורות', 'טיפולים ופרוצדורות', 'טיפולים',    '[ MOD: 06 // RX ]',    40),
  ('footwear',     'נעליים ומדרסים',     'נעליים ומדרסים',     'נעליים',     '[ MOD: 04 // SHOE ]',  50),
  ('sports-feet',  'ספורט וחיילים',      'ספורט ופעילות',      'ספורט',      '[ MOD: 05 // SPORT ]', 60)
on conflict (slug) do update set
  title      = coalesce(public.knowledge_categories.title, excluded.title),
  short_name = coalesce(public.knowledge_categories.short_name, excluded.short_name),
  mod_code   = coalesce(public.knowledge_categories.mod_code, excluded.mod_code);

insert into public.services (slug, nav_label, title, subtitle, meta_title, meta_description, sort_order,
  is_flagship, flagship_title, flagship_tag, flagship_sub, flagship_icon, flagship_accent, card_alt) values
('corns','טיפול ביבלות','טיפול ביבלות וקאלוסים בכף הרגל','הסרה בטוחה, איתור מקור הלחץ ומניעת הישנות','טיפול ביבלות וקאלוסים בכף הרגל | ענבר פרחי','יבלות וקאלוסים הם תגובת לחץ של העור. בקליניקה שלי בבית אל אני מסירה אותן בכלים סטריליים ללא דם, ומאתרת בדיוק את מקור הלחץ כדי שלא יחזרו.',10,false,null,null,null,null,null,null),
('fungus','טיפול בפטרת','טיפול בפטרת כף הרגל ובפטרת ציפורן','אבחון מדויק, פרוטוקול טיפול ארוך-טווח ומניעת הישנות','טיפול בפטרת כף הרגל וציפורן | ענבר פרחי','פטרת בכף הרגל ובציפורן (Tinea pedis, Onychomycosis) — איך מאבחנים נכון, מה כן מטפל ומה לא, ולמה זה לוקח חודשים. מדריך מעמיק של ענבר פרחי.',20,true,'פטרת ציפורניים','פטרת','פרוטוקול מלא: אבחנה, טיפול ושיקום BIO','Droplets','var(--green-500)','ערכת טיפול בפטרת ציפורניים בקליניקה של ענבר פרחי'),
('ingrown-nails','ציפורן חודרנית','טיפול בציפורן חודרנית ללא ניתוח (אורתוניקסיה)','הקלת כאב מיידית, יישור צמיחת הציפורן ומניעת חזרה','ציפורן חודרנית — טיפול ללא ניתוח | ענבר פרחי','ציפורן חודרנית גורמת לכאב, אדמומיות וזיהום. אצלי בקליניקה בבית אל מטפלים בשיטת אורתוניקסיה ללא הרדמה וללא חיתוך — והציפורן חוזרת לכיוון נכון תוך חודשים.',30,true,'ציפורן חודרנית · אורטוניקסיה','אורטוניקסיה','תיקון מבני ללא ניתוח, ללא כאב','Scissors','var(--green-500)','טיפול אורטוניקסיה לציפורן חודרנית בכף הרגל'),
('onycholysis','ציפורן מנותקת','אוניכוליזיס — טיפול בציפורן שמתנתקת ממיטתה','אבחון הסיבה, ייצוב הציפורן ושיקום מבנה בריא','אוניכוליזיס (Onycholysis) — ציפורן מנותקת | ענבר פרחי','ציפורן שמתנתקת ממיטתה — איך מאבחנים את הסיבה, מה לעשות מיד ומה ייקח 6–18 חודשים. מדריך מעמיק מהקליניקה של ענבר פרחי.',40,false,null,null,null,null,null,null),
('cracked-heels','עור קשה וסדקים','טיפול בעור קשה ובסדקים בעקבים','הקלת כאב מיידית, איחוי סדקים והשבת רכות','טיפול בעור קשה וסדקים בעקבים | ענבר פרחי','סדקים בעקבים גורמים לכאב ומסכנים בזיהום. אצלי בקליניקה מסירים את העור הקשה בכלים סטריליים, מאחים את הסדק, ובונים שגרת לחות שעובדת.',50,false,null,null,null,null,null,null),
('diabetic-feet','פדיקור לחולי סוכרת','פדיקור טיפולי לחולי סוכרת','טריאדת הכיב, בדיקת ABI, הפרוטוקול ללא סכינים — והנחיות בית מדויקות','פדיקור טיפולי לחולי סוכרת | ענבר פרחי','פדיקור טיפולי לחולי סוכרת לפי סיכום השתלמות אגודת אייל. טריאדת טראומה-נוירופתיה-איסכמיה, ABI, מחלות עור והפרוטוקול הבטוח בקליניקה.',60,true,'פדיקור לחולי סוכרת','סוכרת','פרוטוקול אגודת אייל, ללא סכינים','HeartPulse','var(--accent-gold)','מגש כלים סטריליים חד־פעמיים לטיפול בכף הרגל הסוכרתית'),
('sports-feet','פדיקור לספורטאים וחיילים','פדיקור לספורטאים, חיילים ומילואימניקים','ציפורן שחורה, שלפוחיות, יבלות מאמץ ופטרת — שיקום מהיר לחזרה לפעילות','פדיקור לספורטאים וחיילים | ענבר פרחי','טיפול בפצעי רגליים של רצים, חיילים ומילואימניקים — שלפוחיות, ציפורניים שחורות, יבלות מאמץ ופטרת. ניסיון רב עם חיילי מילואים בבית אל.',70,false,null,null,null,null,null,null)
on conflict (slug) do update set
  nav_label = excluded.nav_label,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  sort_order = excluded.sort_order,
  is_flagship = excluded.is_flagship,
  flagship_title = excluded.flagship_title,
  flagship_tag = excluded.flagship_tag,
  flagship_sub = excluded.flagship_sub,
  flagship_icon = excluded.flagship_icon,
  flagship_accent = excluded.flagship_accent,
  card_alt = excluded.card_alt;

-- גוף עמודי הטיפולים (סקשנים, שו"ת, מקורות) אינו נזרע כאן.
-- הוא מיובא מקבצי המקור שבקוד דרך פעולת "ייבוא תוכן מהקוד" באדמין
-- (adminImportContentFromSource), כדי להימנע מתמלול ידני של תוכן קליני.
