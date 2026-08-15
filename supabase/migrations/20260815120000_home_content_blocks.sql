-- ============================================================================
-- מקטעי דף הבית
--
-- תשעת המקטעים החוזרים בדף הבית (כרטיסי טיפולים, בועות, שלבי התהליך,
-- מסלולי האקדמיה, "למה אצלי", הסמכות, דגלים אדומים, שאלות נפוצות)
-- היו קשיחים בתוך index.tsx. הטבלה הזו מאפשרת לערוך אותם מהאדמין.
--
-- item_schema מתאר את שדות הפריט, ולכן טופס העריכה נבנה מהנתונים
-- והוספת מקטע חדש אינה דורשת מסך חדש.
--
-- התוכן עצמו אינו נזרע כאן אלא מיובא מ-src/lib/home-content.ts דרך
-- פעולת "ייבוא תוכן" באדמין, כדי להימנע מתמלול ידני.
-- ============================================================================

create table if not exists public.content_blocks (
  block_key    text primary key,
  label        text not null,
  description  text,
  heading      text,
  subheading   text,
  items        jsonb not null default '[]'::jsonb,
  item_schema  jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  updated_at   timestamptz not null default now()
);

alter table public.content_blocks enable row level security;

drop policy if exists "content_blocks public read" on public.content_blocks;
create policy "content_blocks public read"
  on public.content_blocks for select using (is_published = true);

drop policy if exists "content_blocks admin all" on public.content_blocks;
create policy "content_blocks admin all"
  on public.content_blocks for all
  using (public.is_admin()) with check (public.is_admin());

drop trigger if exists content_blocks_updated_at on public.content_blocks;
create trigger content_blocks_updated_at before update on public.content_blocks
  for each row execute function public.set_updated_at();

-- גלריית לפני/אחרי תומכת גם בתמונה אחת משולבת (כפי שמופיע היום בדף הבית)
-- וגם בזוג תמונות נפרדות.
alter table public.before_after alter column after_image drop not null;

-- כתובת האתר הוסרה מטופס ההגדרות: הקנוניקלים נקראים מהקוד, ולכן שדה
-- שניתן לעריכה שם היה מטעה. השורה נשמרת לשימוש הסכמה והסייטמאפ.
update public.site_settings set group_key = 'system' where key = 'site_url';

-- פנייה תקינה היא כזו שאפשר לחזור אליה: אימייל תקין או טלפון.
-- קודם לכן נדרש אימייל, מה שחסם פנייה טלפונית; וגם לא נמנעה הזרקת
-- סטטוס והערות מהדפדפן.
drop policy if exists "Anyone can submit a lead" on public.leads;
create policy "Anyone can submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (
    (
      (email is not null and char_length(email) <= 255
        and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
      or
      (phone is not null and char_length(phone) between 9 and 20
        and phone ~ '^[0-9+\-\s()]+$')
    )
    and (source_page is null or char_length(source_page) <= 2048)
    and (name is null or char_length(name) <= 120)
    and (message is null or char_length(message) <= 2000)
    and (service_slug is null or char_length(service_slug) <= 120)
    and status = 'new'
    and notes is null
    and handled_at is null
  );
