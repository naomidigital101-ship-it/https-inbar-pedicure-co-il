export type ClinicClient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string | null;
  notes: string;
  health_notes: string;
  created_at: string;
  source_lead_id: string | null;
};
export type ClinicAppointment = {
  id: string;
  client_id: string;
  starts_at: string;
  duration: number;
  service: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
};
export type ClinicVisit = {
  id: string;
  client_id: string;
  appointment_id: string | null;
  visited_at: string;
  service: string;
  price_cents: number;
  notes: string;
  home_care: string;
  next_visit: string | null;
  before_path: string | null;
  after_path: string | null;
};
export type ClinicPayment = {
  id: string;
  client_id: string;
  visit_id: string;
  amount_cents: number;
  method: string;
  paid_at: string;
};
export type ClinicFollowup = {
  id: string;
  client_id: string;
  due_date: string;
  completed_at: string | null;
};
export type ClinicSnapshot = {
  clients: ClinicClient[];
  appointments: ClinicAppointment[];
  visits: ClinicVisit[];
  payments: ClinicPayment[];
  followups: ClinicFollowup[];
};
export const PAYMENT_METHODS = ["מזומן", "העברה", "אשראי", "ביט"] as const;
export const clinicDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
export const clinicTime = (value: string) =>
  new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
export const clinicDateLabel = (value: string) =>
  new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(value.length === 10 ? value + "T12:00:00+02:00" : value));
export const clinicMoney = (cents: number) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 2,
  }).format(cents / 100);
