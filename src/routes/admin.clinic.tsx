import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  CalendarDays,
  Users,
  Bell,
  Plus,
  Phone,
  ArrowRight,
  Check,
  Wallet,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  PageHeader,
  Button,
  TextInput,
  TextArea,
  Select,
  EmptyState,
  Badge,
} from "@/components/admin/AdminUI";
import {
  clinicSnapshot,
  clinicWrite,
  clinicUploadPhoto,
  clinicPhotoUrl,
  type ClinicWriteInput,
} from "@/lib/clinic.functions";
import { adminListLeads, adminListServices } from "@/lib/admin-cms.functions";
import {
  clinicDate,
  clinicDateLabel,
  clinicTime,
  clinicMoney,
  PAYMENT_METHODS,
  type ClinicClient,
  type ClinicAppointment,
  type ClinicVisit,
  type ClinicSnapshot,
} from "@/lib/clinic-types";
import "@/components/admin/clinic.css";

const VIEWS = [
  { id: "today", label: "היום שלי", icon: CalendarDays },
  { id: "clients", label: "לקוחות", icon: Users },
  { id: "calendar", label: "יומן תורים", icon: CalendarDays },
  { id: "followups", label: "מעקבים", icon: Bell },
] as const;
export const Route = createFileRoute("/admin/clinic")({
  head: () => ({
    meta: [
      { title: "ניהול הקליניקה | ענבר פרחי" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    view: VIEWS.some((v) => v.id === s.view)
      ? (s.view as (typeof VIEWS)[number]["id"])
      : ("today" as const),
    client: typeof s.client === "string" ? s.client : undefined,
    lead: typeof s.lead === "string" ? s.lead : undefined,
  }),
  component: ClinicPage,
});
type Modal =
  | { kind: "client"; client?: ClinicClient }
  | { kind: "appointment"; appointment?: ClinicAppointment; clientId?: string }
  | { kind: "visit"; appointment?: ClinicAppointment; clientId?: string }
  | { kind: "payment"; visit: ClinicVisit };
const EMPTY: ClinicSnapshot = {
  clients: [],
  appointments: [],
  visits: [],
  payments: [],
  followups: [],
};
const nowLocal = () => `${clinicDate()}T${clinicTime(new Date().toISOString())}`;
const addDays = (day: string, n: number) => {
  const d = new Date(day + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const clientHref = (id: string) => `/admin/clinic?view=clients&client=${id}`;

function ClinicPage() {
  const search = Route.useSearch();
  const qc = useQueryClient();
  const read = useServerFn(clinicSnapshot),
    write = useServerFn(clinicWrite),
    leadsRead = useServerFn(adminListLeads),
    servicesRead = useServerFn(adminListServices);
  const query = useQuery({ queryKey: ["admin", "clinic"], queryFn: () => read() });
  const leads = useQuery({ queryKey: ["admin", "leads"], queryFn: () => leadsRead() });
  const services = useQuery({ queryKey: ["admin", "services"], queryFn: () => servicesRead() });
  const data = query.data ?? EMPTY;
  const [modal, setModal] = useState<Modal | null>(null);
  const [filter, setFilter] = useState("");
  const [day, setDay] = useState(clinicDate());
  const [range, setRange] = useState<"day" | "week">("day");
  const [cancel, setCancel] = useState<ClinicAppointment | null>(null);
  const mutation = useMutation({
    mutationFn: (input: ClinicWriteInput) => write({ data: input }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin", "clinic"] }),
        qc.invalidateQueries({ queryKey: ["admin", "leads"] }),
      ]);
    },
    onError: (e) => {
      if (!modal) toast.error(e instanceof Error ? e.message : "השמירה נכשלה");
    },
  });
  const person = (id: string) => data.clients.find((c) => c.id === id);
  const paymentsFor = (id: string) =>
    data.payments.filter((p) => p.visit_id === id).reduce((sum, p) => sum + p.amount_cents, 0);
  const debtFor = (id: string) =>
    data.visits
      .filter((v) => v.client_id === id)
      .reduce((sum, v) => sum + v.price_cents - paymentsFor(v.id), 0);
  const followups = data.followups
    .filter((f) => !f.completed_at)
    .sort((a, b) => a.due_date.localeCompare(b.due_date));
  const today = clinicDate();
  const newLeads = leads.data?.leads.filter((l) => l.status === "new") ?? [];
  const selected = person(search.client ?? "");
  const lead = leads.data?.leads.find((l) => l.id === search.lead);
  const serviceNames = services.data?.services.map((s) => s.nav_label) ?? [];
  async function convertLead(id: string) {
    const result = await mutation.mutateAsync({ action: "lead", lead_id: id });
    window.location.assign(clientHref(result.id));
  }
  function appointmentRows(items: ClinicAppointment[]) {
    return items.length ? (
      items.map((a) => (
        <div className="clinic-row" key={a.id}>
          <div className="clinic-time">
            <strong>{clinicTime(a.starts_at)}</strong>
            <small>{clinicDateLabel(a.starts_at)}</small>
          </div>
          <div className="clinic-row-main">
            <a className="clinic-person" href={clientHref(a.client_id)}>
              {person(a.client_id)?.name ?? "לקוחה"}
            </a>
            <p>
              {a.service} · {a.duration} דקות
            </p>
            {a.notes && <small>{a.notes}</small>}
          </div>
          <Badge
            tone={
              a.status === "completed" ? "success" : a.status === "cancelled" ? "muted" : "neutral"
            }
          >
            {a.status === "scheduled" ? "נקבע" : a.status === "completed" ? "הושלם" : "בוטל"}
          </Badge>
          {a.status === "scheduled" && (
            <div className="clinic-actions">
              <Button
                onClick={() => setModal({ kind: "visit", appointment: a, clientId: a.client_id })}
                variant="primary"
              >
                סיום טיפול
              </Button>
              <Button onClick={() => setModal({ kind: "appointment", appointment: a })}>
                שינוי תור
              </Button>
              <Button variant="ghost" onClick={() => setCancel(a)}>
                ביטול תור
              </Button>
            </div>
          )}
        </div>
      ))
    ) : (
      <EmptyState title="אין תורים להצגה" hint="אפשר לקבוע תור חדש באמצעות הכפתור למעלה." />
    );
  }
  if (query.isPending) return <p role="status">טוענת את ניהול הקליניקה...</p>;
  if (query.isError)
    return (
      <Card title="לא הצלחנו לטעון את הקליניקה">
        <p role="alert">{query.error.message}</p>
        <Button onClick={() => query.refetch()}>ניסיון נוסף</Button>
      </Card>
    );
  return (
    <div className="clinic-page">
      <PageHeader
        title="ניהול הקליניקה"
        description="התורים, הלקוחות והמעקבים שלך במקום אחד."
        actions={
          <>
            <Button onClick={() => setModal({ kind: "client" })}>
              <Plus size={17} />
              לקוחה חדשה
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                setModal(data.clients.length ? { kind: "appointment" } : { kind: "client" })
              }
            >
              <CalendarDays size={17} />
              קביעת תור
            </Button>
          </>
        }
      />
      <div className="clinic-source-notice">
        נתוני המערכת הקודמת טרם הועברו. הנתונים שתוסיפי כאן נשמרים במערכת החדשה.
      </div>
      <nav className="clinic-tabs" aria-label="ניהול הקליניקה">
        {VIEWS.map((v) => (
          <a
            key={v.id}
            className={search.view === v.id ? "is-active" : ""}
            aria-current={search.view === v.id ? "page" : undefined}
            href={`/admin/clinic?view=${v.id}`}
          >
            <v.icon size={18} />
            {v.label}
          </a>
        ))}
      </nav>
      {lead && (
        <Card
          title={`פתיחת כרטיס עבור ${lead.name ?? "הפנייה"}`}
          description="נשתמש בשם, בטלפון ובאימייל שכבר הושארו בפנייה. אם המספר קיים, נפתח את הכרטיס הקיים."
        >
          <p>{lead.phone}</p>
          <Button
            loading={mutation.isPending}
            variant="primary"
            onClick={() => {
              void convertLead(lead.id).catch(() => {});
            }}
          >
            פתיחת כרטיס לקוחה
          </Button>
        </Card>
      )}
      {search.view === "today" && (
        <>
          <div className="admin-welcome clinic-welcome">
            <div>
              <h2>
                היום שלך,{" "}
                <bdi dir="ltr" className="clinic-number">
                  {clinicDateLabel(today)}
                </bdi>
              </h2>
              <p>כל מה שצריך לטפל בו היום, בלי לעבור בין מסכים.</p>
            </div>
            <Button
              onClick={() => setModal(data.clients.length ? { kind: "visit" } : { kind: "client" })}
            >
              רישום טיפול ללא תור
            </Button>
          </div>
          <div className="admin-stats clinic-stats">
            {[
              {
                label: "תורים להיום",
                value: data.appointments.filter(
                  (a) => clinicDate(new Date(a.starts_at)) === today && a.status !== "cancelled",
                ).length,
              },
              { label: "פניות חדשות", value: leads.isError ? "—" : newLeads.length },
              {
                label: "מעקבים שהגיע זמנם",
                value: followups.filter((f) => f.due_date <= today).length,
              },
              {
                label: "יתרה לתשלום",
                value: clinicMoney(
                  data.visits.reduce((s, v) => s + v.price_cents - paymentsFor(v.id), 0),
                ),
              },
            ].map((s) => (
              <div className="admin-stat" key={s.label}>
                <p>{s.label}</p>
                <strong className="clinic-metric">{s.value}</strong>
              </div>
            ))}
          </div>
          <Card title="התורים להיום" actions={<a href="/admin/clinic?view=calendar">לכל התורים</a>}>
            {appointmentRows(
              data.appointments
                .filter(
                  (a) => clinicDate(new Date(a.starts_at)) === today && a.status !== "cancelled",
                )
                .sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
            )}
          </Card>
          <Card title="פניות שמחכות למענה" actions={<a href="/admin/leads">לכל הפניות</a>}>
            {leads.isError ? (
              <p role="alert">
                הפניות לא נטענו. <button onClick={() => leads.refetch()}>נסי שוב</button>
              </p>
            ) : newLeads.length ? (
              newLeads.slice(0, 8).map((l) => (
                <div className="clinic-row" key={l.id}>
                  <div className="clinic-row-main">
                    <strong>{l.name ?? "פנייה חדשה"}</strong>
                    <p>{l.message}</p>
                    {l.phone && (
                      <a dir="ltr" href={`tel:${l.phone.replace(/[^+\d]/g, "")}`}>
                        {l.phone}
                      </a>
                    )}
                  </div>
                  <Button
                    loading={mutation.isPending}
                    onClick={() => {
                      void convertLead(l.id).catch(() => {});
                    }}
                  >
                    פתיחת כרטיס וקביעת תור
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState title="אין פניות חדשות" />
            )}
          </Card>
        </>
      )}
      {search.view === "calendar" && (
        <>
          <Card
            title="יומן תורים"
            actions={
              <div className="clinic-actions">
                <Button
                  aria-label="לתקופה הקודמת"
                  onClick={() => setDay(addDays(day, range === "week" ? -7 : -1))}
                >
                  <ArrowRight size={17} />
                </Button>
                <TextInput
                  aria-label="תאריך להצגת התורים"
                  type="date"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
                <Button onClick={() => setDay(today)}>היום</Button>
                <Select
                  aria-label="טווח היומן"
                  value={range}
                  onChange={(e) => setRange(e.target.value as "day" | "week")}
                >
                  <option value="day">יום</option>
                  <option value="week">שבוע</option>
                </Select>
                <Button
                  aria-label="לתקופה הבאה"
                  onClick={() => setDay(addDays(day, range === "week" ? 7 : 1))}
                >
                  <ArrowRight size={17} style={{ transform: "rotate(180deg)" }} />
                </Button>
              </div>
            }
          >
            {appointmentRows(
              data.appointments
                .filter((a) => {
                  const d = clinicDate(new Date(a.starts_at));
                  return d >= day && d <= addDays(day, range === "week" ? 6 : 0);
                })
                .sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
            )}
          </Card>
          <p className="clinic-muted">
            התורים נשמרים ביומן הקליניקה. אין כרגע סנכרון עם Google Calendar.
          </p>
        </>
      )}
      {search.view === "clients" && !selected && (
        <Card
          title="הלקוחות שלך"
          actions={
            <div className="clinic-search">
              <Search size={17} />
              <TextInput
                aria-label="חיפוש לקוחה לפי שם או טלפון"
                placeholder="שם או טלפון"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          }
        >
          {data.clients
            .filter((c) => c.name.includes(filter) || c.phone.includes(filter.replace(/[ -]/g, "")))
            .map((c) => (
              <div className="clinic-row" key={c.id}>
                <div className="clinic-row-main">
                  <a className="clinic-person" href={clientHref(c.id)}>
                    {c.name}
                  </a>
                  <p dir="ltr">{c.phone}</p>
                </div>
                {debtFor(c.id) > 0 && <Badge tone="warn">יתרה: {clinicMoney(debtFor(c.id))}</Badge>}
                <Button onClick={() => setModal({ kind: "appointment", clientId: c.id })}>
                  קביעת תור
                </Button>
                <a href={clientHref(c.id)}>לכרטיס הלקוחה</a>
              </div>
            ))}
          {!data.clients.length && (
            <EmptyState
              title="כאן יופיעו הלקוחות שלך"
              hint="התחילי בלקוחה חדשה, או פתחי כרטיס מתוך פנייה באתר."
            />
          )}
          {!!data.clients.length &&
            !data.clients.some(
              (c) => c.name.includes(filter) || c.phone.includes(filter.replace(/[ -]/g, "")),
            ) && <EmptyState title="לא נמצאו לקוחות בחיפוש הזה" />}
        </Card>
      )}
      {search.view === "clients" && selected && (
        <>
          <a className="clinic-back" href="/admin/clinic?view=clients">
            <ArrowRight size={17} />
            לכל הלקוחות
          </a>
          <Card
            title={selected.name}
            actions={
              <>
                <Button onClick={() => setModal({ kind: "client", client: selected })}>
                  עריכת פרטים
                </Button>
                <Button onClick={() => setModal({ kind: "appointment", clientId: selected.id })}>
                  קביעת תור
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setModal({ kind: "visit", clientId: selected.id })}
                >
                  רישום טיפול
                </Button>
              </>
            }
          >
            <div className="clinic-profile-grid">
              <div>
                <Label>טלפון</Label>
                <a href={`tel:${selected.phone}`} dir="ltr">
                  <Phone size={15} />
                  {selected.phone}
                </a>
              </div>
              <div>
                <Label>אימייל</Label>
                <span>{selected.email || "לא צוין"}</span>
              </div>
              <div>
                <Label>יום הולדת</Label>
                <span>{selected.birthday ? clinicDateLabel(selected.birthday) : "לא צוין"}</span>
              </div>
              <div>
                <Label>יתרה לתשלום</Label>
                <strong>{clinicMoney(debtFor(selected.id))}</strong>
              </div>
            </div>
            {selected.notes && <p className="clinic-preserve">{selected.notes}</p>}
            {selected.health_notes && (
              <details className="clinic-health">
                <summary>מידע רגיש שענבר תיעדה</summary>
                <p className="clinic-preserve">{selected.health_notes}</p>
              </details>
            )}
          </Card>
          <Card title="תורים קרובים">
            {appointmentRows(
              data.appointments
                .filter(
                  (a) =>
                    a.client_id === selected.id &&
                    a.status === "scheduled" &&
                    a.starts_at >= new Date().toISOString(),
                )
                .sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
            )}
          </Card>
          <Card title="היסטוריית טיפולים">
            {data.visits
              .filter((v) => v.client_id === selected.id)
              .map((v) => (
                <article className="clinic-visit" key={v.id}>
                  <div className="clinic-row">
                    <div className="clinic-row-main">
                      <h3>{v.service}</h3>
                      <p>
                        {clinicDateLabel(v.visited_at)} · {clinicTime(v.visited_at)}
                      </p>
                    </div>
                    <Badge tone={paymentsFor(v.id) >= v.price_cents ? "success" : "warn"}>
                      {paymentsFor(v.id) >= v.price_cents
                        ? "שולם"
                        : `יתרה: ${clinicMoney(v.price_cents - paymentsFor(v.id))}`}
                    </Badge>
                    {paymentsFor(v.id) < v.price_cents && (
                      <Button onClick={() => setModal({ kind: "payment", visit: v })}>
                        רישום תשלום
                      </Button>
                    )}
                  </div>
                  <p className="clinic-preserve">{v.notes}</p>
                  {v.home_care && (
                    <p className="clinic-preserve">
                      <strong>הנחיות שענבר תיעדה: </strong>
                      {v.home_care}
                    </p>
                  )}
                  {v.next_visit && <p>ביקור הבא: {clinicDateLabel(v.next_visit)}</p>}
                  <div className="clinic-photo-links">
                    {v.before_path && <PrivatePhoto path={v.before_path} label="תמונה לפני" />}
                    {v.after_path && <PrivatePhoto path={v.after_path} label="תמונה אחרי" />}
                  </div>
                  <details>
                    <summary>פירוט התשלומים</summary>
                    <p>מחיר טיפול: {clinicMoney(v.price_cents)}</p>
                    {data.payments
                      .filter((p) => p.visit_id === v.id)
                      .map((p) => (
                        <p key={p.id}>
                          {clinicDateLabel(p.paid_at)} · {p.method} · {clinicMoney(p.amount_cents)}
                        </p>
                      ))}
                  </details>
                </article>
              ))}
            {!data.visits.some((v) => v.client_id === selected.id) && (
              <EmptyState title="עדיין לא תועדו טיפולים" />
            )}
          </Card>
        </>
      )}
      {search.view === "clients" && search.client && !selected && (
        <p role="alert">
          כרטיס הלקוחה לא נמצא. <a href="/admin/clinic?view=clients">חזרה לרשימה</a>
        </p>
      )}
      {search.view === "followups" && (
        <>
          <Card
            title="מעקבים וביקורים חוזרים"
            description="תזכורות לפי התאריך שענבר קבעה בסיום הטיפול. תור עתידי שכבר נקבע מופיע ליד המעקב."
          >
            {followups.length ? (
              followups.map((f) => (
                <div className="clinic-row" key={f.id}>
                  <div className="clinic-row-main">
                    <a className="clinic-person" href={clientHref(f.client_id)}>
                      {person(f.client_id)?.name ?? "לקוחה"}
                    </a>
                    <p>{clinicDateLabel(f.due_date)}</p>
                    {data.appointments.some(
                      (a) =>
                        a.client_id === f.client_id &&
                        a.status === "scheduled" &&
                        a.starts_at >= new Date().toISOString(),
                    ) && <small>כבר נקבע תור עתידי</small>}
                  </div>
                  <Badge tone={f.due_date < today ? "warn" : "neutral"}>
                    {f.due_date < today ? "התאריך עבר" : f.due_date === today ? "היום" : "בהמשך"}
                  </Badge>
                  <Button onClick={() => setModal({ kind: "appointment", clientId: f.client_id })}>
                    קביעת תור
                  </Button>
                  <Button
                    loading={mutation.isPending}
                    onClick={() => {
                      void mutation
                        .mutateAsync({ action: "followup", id: f.id })
                        .then(() => toast.success("המעקב סומן כטופל"))
                        .catch(() => {});
                    }}
                  >
                    <Check size={16} />
                    טופל
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState
                title="אין מעקבים פתוחים"
                hint="בסיום טיפול תוכלי לקבוע מתי כדאי לחזור, והמעקב יופיע כאן."
              />
            )}
          </Card>
          <Card title="לקוחות שלא ביקרו שלושה חודשים">
            {data.clients
              .filter((c) => {
                const last = data.visits
                  .filter((v) => v.client_id === c.id)
                  .sort((a, b) => b.visited_at.localeCompare(a.visited_at))[0];
                return last && clinicDate(new Date(last.visited_at)) <= addDays(today, -90);
              })
              .map((c) => (
                <div className="clinic-row" key={c.id}>
                  <a className="clinic-person clinic-row-main" href={clientHref(c.id)}>
                    {c.name}
                  </a>
                  <a href={`tel:${c.phone}`}>להתקשר</a>
                  <Button onClick={() => setModal({ kind: "appointment", clientId: c.id })}>
                    קביעת תור
                  </Button>
                </div>
              ))}
            <p className="clinic-muted">
              הרשימה מתבססת על טיפולים שתועדו במערכת הזאת. לא נשלחות הודעות אוטומטיות.
            </p>
          </Card>
        </>
      )}
      {modal && (
        <ClinicForm
          key={JSON.stringify(modal)}
          modal={modal}
          data={data}
          services={serviceNames}
          onClose={() => setModal(null)}
          onSave={async (input) => {
            const result = await mutation.mutateAsync(input);
            setModal(null);
            toast.success("נשמר בהצלחה");
            if (input.action === "client") window.location.assign(clientHref(result.id));
          }}
        />
      )}
      <Dialog
        open={!!cancel}
        onOpenChange={(open) => {
          if (!open) setCancel(null);
        }}
      >
        <DialogContent className="admin-theme clinic-dialog" dir="rtl">
          <DialogHeader>
            <DialogTitle>לבטל את התור?</DialogTitle>
            <DialogDescription>
              {cancel &&
                `${person(cancel.client_id)?.name ?? ""} · ${clinicDateLabel(cancel.starts_at)} · ${clinicTime(cancel.starts_at)}`}
            </DialogDescription>
          </DialogHeader>
          <p>התור יישאר בהיסטוריה עם סימון ״בוטל״.</p>
          <div className="clinic-actions">
            <Button onClick={() => setCancel(null)}>להשאיר את התור</Button>
            <Button
              variant="danger"
              loading={mutation.isPending}
              onClick={() => {
                if (cancel)
                  void mutation
                    .mutateAsync({ action: "cancel", id: cancel.id })
                    .then(() => {
                      setCancel(null);
                      toast.success("התור בוטל");
                    })
                    .catch(() => {});
              }}
            >
              ביטול תור
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className="clinic-profile-label">{children}</span>;
}
function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "clinic-field clinic-field-wide" : "clinic-field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}
function ClinicForm({
  modal,
  data,
  services,
  onClose,
  onSave,
}: {
  modal: Modal;
  data: ClinicSnapshot;
  services: string[];
  onClose: () => void;
  onSave: (input: ClinicWriteInput) => Promise<void>;
}) {
  const [requestId] = useState(() => crypto.randomUUID());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const upload = useServerFn(clinicUploadPhoto);
  const client = modal.kind === "client" ? modal.client : undefined;
  const appt =
    modal.kind === "appointment" || modal.kind === "visit" ? modal.appointment : undefined;
  const clientId =
    modal.kind === "client"
      ? ""
      : modal.kind === "payment"
        ? modal.visit.client_id
        : (appt?.client_id ?? modal.clientId ?? data.clients[0]?.id ?? "");
  const remaining =
    modal.kind === "payment"
      ? modal.visit.price_cents -
        data.payments
          .filter((p) => p.visit_id === modal.visit.id)
          .reduce((s, p) => s + p.amount_cents, 0)
      : 0;
  const title =
    modal.kind === "client"
      ? client
        ? "עריכת פרטי לקוחה"
        : "לקוחה חדשה"
      : modal.kind === "appointment"
        ? appt
          ? "שינוי תור"
          : "קביעת תור"
        : modal.kind === "visit"
          ? "סיום ותיעוד טיפול"
          : "רישום תשלום";
  async function photoUpload(file: File | undefined, slot: "before" | "after") {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      if (file.size > 2097152) throw new Error("התמונה גדולה מדי. בחרי תמונה עד 2MB.");
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const result = await upload({
        data: {
          visit_id: requestId,
          slot,
          mime: file.type as "image/jpeg" | "image/png" | "image/webp",
          base64,
        },
      });
      if (slot === "before") setBefore(result.path);
      else setAfter(result.path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "התמונה לא הועלתה");
    } finally {
      setUploading(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const s = (key: string) => String(form.get(key) ?? "");
    const cents = (key: string) => Math.round(Number(s(key)) * 100);
    try {
      let input: ClinicWriteInput;
      if (modal.kind === "client")
        input = {
          action: "client",
          id: client?.id,
          name: s("name"),
          phone: s("phone"),
          email: s("email"),
          birthday: s("birthday"),
          notes: s("notes"),
          health_notes: s("health_notes"),
        };
      else if (modal.kind === "appointment")
        input = {
          action: "appointment",
          id: appt?.id ?? requestId,
          client_id: s("client_id"),
          start_local: s("start_local"),
          duration: Number(s("duration")),
          service: s("service"),
          notes: s("notes"),
        };
      else if (modal.kind === "visit")
        input = {
          action: "visit",
          id: requestId,
          client_id: s("client_id"),
          appointment_id: appt?.id ?? "",
          visit_local: s("visit_local"),
          service: s("service"),
          price_cents: cents("price"),
          paid_cents: cents("paid"),
          method: s("method") as (typeof PAYMENT_METHODS)[number],
          notes: s("notes"),
          home_care: s("home_care"),
          next_visit: s("next_visit"),
          before_path: before,
          after_path: after,
        };
      else
        input = {
          action: "payment",
          id: requestId,
          visit_id: modal.visit.id,
          amount_cents: cents("amount"),
          method: s("method") as (typeof PAYMENT_METHODS)[number],
        };
      await onSave(input);
    } catch (e) {
      setError(e instanceof Error ? e.message : "השמירה לא הושלמה");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy && !uploading) onClose();
      }}
    >
      <DialogContent
        className="admin-theme clinic-dialog"
        dir="rtl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {modal.kind === "visit"
              ? "הטיפול והתשלום נשמרים יחד. תמונות הטיפול נשארות פרטיות."
              : "מלאי את הפרטים ושמרי בסיום."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <fieldset disabled={busy || uploading} className="clinic-form-grid">
            {modal.kind === "client" ? (
              <>
                <Field label="שם מלא">
                  <TextInput name="name" required maxLength={160} defaultValue={client?.name} />
                </Field>
                <Field label="טלפון">
                  <TextInput
                    name="phone"
                    type="tel"
                    dir="ltr"
                    required
                    pattern="[+0-9 \-]{8,20}"
                    defaultValue={client?.phone}
                  />
                </Field>
                <Field label="אימייל">
                  <TextInput name="email" type="email" defaultValue={client?.email} />
                </Field>
                <Field label="יום הולדת">
                  <TextInput name="birthday" type="date" defaultValue={client?.birthday ?? ""} />
                </Field>
                <Field label="הערות" wide>
                  <TextArea name="notes" rows={3} maxLength={10000} defaultValue={client?.notes} />
                </Field>
                <Field label="מידע רגיש שענבר תיעדה" wide>
                  <TextArea
                    name="health_notes"
                    rows={3}
                    maxLength={10000}
                    defaultValue={client?.health_notes}
                  />
                </Field>
              </>
            ) : (
              <>
                {modal.kind !== "payment" && (
                  <Field label="לקוחה" wide>
                    <Select name="client_id" defaultValue={clientId} required disabled={!!appt}>
                      {data.clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} · {c.phone}
                        </option>
                      ))}
                    </Select>
                    {appt && <input type="hidden" name="client_id" value={clientId} />}
                  </Field>
                )}
                {modal.kind === "appointment" && (
                  <>
                    <Field label="תאריך ושעה">
                      <TextInput
                        name="start_local"
                        type="datetime-local"
                        required
                        defaultValue={
                          appt
                            ? `${clinicDate(new Date(appt.starts_at))}T${clinicTime(appt.starts_at)}`
                            : nowLocal()
                        }
                      />
                    </Field>
                    <Field label="משך התור בדקות">
                      <TextInput
                        name="duration"
                        type="number"
                        required
                        min={10}
                        max={240}
                        step={5}
                        defaultValue={appt?.duration ?? 45}
                      />
                    </Field>
                  </>
                )}
                {modal.kind === "visit" && (
                  <Field label="מועד הטיפול">
                    <TextInput
                      name="visit_local"
                      type="datetime-local"
                      required
                      defaultValue={nowLocal()}
                    />
                  </Field>
                )}
                {modal.kind !== "payment" && (
                  <Field label="סוג הטיפול">
                    <TextInput
                      name="service"
                      required
                      maxLength={160}
                      list="clinic-service-names"
                      defaultValue={appt?.service ?? ""}
                    />
                    <datalist id="clinic-service-names">
                      {services.map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </Field>
                )}
                {modal.kind === "visit" && (
                  <>
                    <Field label="מחיר הטיפול (₪)">
                      <TextInput
                        name="price"
                        type="number"
                        required
                        min={0}
                        max={100000}
                        step="0.01"
                        defaultValue={0}
                      />
                    </Field>
                    <Field label="התקבל עכשיו (₪)">
                      <TextInput
                        name="paid"
                        type="number"
                        required
                        min={0}
                        max={100000}
                        step="0.01"
                        defaultValue={0}
                      />
                    </Field>
                    <Field label="אמצעי תשלום">
                      <Select name="method">
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="ביקור הבא">
                      <TextInput name="next_visit" type="date" min={clinicDate()} />
                    </Field>
                  </>
                )}
                {modal.kind === "payment" && (
                  <>
                    <p className="clinic-field-wide">יתרה לטיפול: {clinicMoney(remaining)}</p>
                    <Field label="סכום שהתקבל (₪)">
                      <TextInput
                        name="amount"
                        type="number"
                        required
                        min="0.01"
                        max={remaining / 100}
                        step="0.01"
                        defaultValue={remaining / 100}
                      />
                    </Field>
                    <Field label="אמצעי תשלום">
                      <Select name="method">
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </Select>
                    </Field>
                    <p className="clinic-muted clinic-field-wide">
                      זהו רישום תשלום שהתקבל. המערכת אינה מבצעת חיוב ואינה מפיקה קבלה.
                    </p>
                  </>
                )}
                {modal.kind !== "payment" && (
                  <Field label={modal.kind === "visit" ? "סיכום הטיפול" : "הערות לתור"} wide>
                    <TextArea name="notes" rows={3} maxLength={10000} defaultValue={appt?.notes} />
                  </Field>
                )}
                {modal.kind === "visit" && (
                  <>
                    <Field label="הנחיות שענבר נתנה להמשך" wide>
                      <TextArea name="home_care" rows={3} maxLength={10000} />
                    </Field>
                    <Field label="תמונה לפני">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          void photoUpload(e.target.files?.[0], "before");
                        }}
                      />
                      {before && <span role="status">התמונה הועלתה</span>}
                    </Field>
                    <Field label="תמונה אחרי">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          void photoUpload(e.target.files?.[0], "after");
                        }}
                      />
                      {after && <span role="status">התמונה הועלתה</span>}
                    </Field>
                    <p className="clinic-muted clinic-field-wide">
                      עד 2MB לתמונה. התמונות נשמרות בכרטיס בלבד ואינן מתפרסמות באתר.
                    </p>
                  </>
                )}
              </>
            )}
          </fieldset>
          {uploading && <p role="status">מעלה את התמונה...</p>}
          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}
          <div className="clinic-form-footer">
            <Button type="button" disabled={busy || uploading} onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit" variant="primary" loading={busy} disabled={uploading}>
              שמירה
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function PrivatePhoto({ path, label }: { path: string; label: string }) {
  const url = useServerFn(clinicPhotoUrl);
  const [src, setSrc] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div>
      {src ? (
        <img className="clinic-private-photo" src={src} alt={label} />
      ) : (
        <Button
          loading={busy}
          onClick={() => {
            setBusy(true);
            void url({ data: { path } })
              .then((r) => setSrc(r.url))
              .catch(() => toast.error("לא הצלחנו לפתוח את התמונה"))
              .finally(() => setBusy(false));
          }}
        >
          {label}
        </Button>
      )}
    </div>
  );
}
