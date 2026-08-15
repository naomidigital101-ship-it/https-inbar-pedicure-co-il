/**
 * ערכת רכיבים לממשק הניהול.
 *
 * הממשק מיועד לבעלת העסק, לא למפתחת: עברית מלאה, RTL, בלי ז'רגון,
 * בלי JSON גלוי. הצבעים נשענים על טוקני המותג של האתר (styles.css)
 * כדי שהאדמין ירגיש חלק מאותו מוצר.
 */

import { forwardRef, type ReactNode } from "react";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// מבנה עמוד
// ---------------------------------------------------------------------------

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1
          className="text-[26px] md:text-[30px]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            color: "var(--ink-900)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[14.5px]" style={{ color: "var(--ink-600)" }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  description,
  children,
  actions,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section
      className="mb-6 overflow-hidden bg-white"
      style={{ border: "1px solid var(--stone-100)", borderRadius: 14 }}
    >
      {(title || actions) && (
        <header
          className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6"
          style={{ borderBottom: "1px solid var(--stone-100)", background: "var(--green-50)" }}
        >
          <div>
            {title && (
              <h2
                className="text-[16.5px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink-900)" }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-[13.5px]" style={{ color: "var(--ink-600)" }}>
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="px-5 py-5 md:px-6">{children}</div>
    </section>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div
      className="px-6 py-12 text-center"
      style={{ border: "1px dashed var(--stone-300)", borderRadius: 12 }}
    >
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink-900)" }}>
        {title}
      </p>
      {hint && (
        <p className="mx-auto mt-1.5 max-w-md text-[13.5px]" style={{ color: "var(--ink-600)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// כפתורים
// ---------------------------------------------------------------------------

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", loading, children, className = "", disabled, ...rest },
  ref,
) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "var(--accent)", color: "#fff", border: "1px solid var(--accent)" },
    secondary: {
      background: "#fff",
      color: "var(--green-700)",
      border: "1px solid var(--stone-300)",
    },
    ghost: { background: "transparent", color: "var(--ink-600)", border: "1px solid transparent" },
    danger: { background: "#fff", color: "#B4231C", border: "1px solid #E9C4C1" },
  };
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] transition-opacity disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
      style={{ ...styles[variant], borderRadius: 999, fontWeight: 700 }}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});

// ---------------------------------------------------------------------------
// שדות טופס
// ---------------------------------------------------------------------------

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--stone-300)",
  borderRadius: 10,
  background: "#fff",
  color: "var(--ink-900)",
};

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string | null;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[13.5px]"
        style={{ fontWeight: 700, color: "var(--ink-900)" }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-[12.5px]" style={{ color: "var(--ink-600)" }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1 text-[12.5px]" style={{ color: "#B4231C", fontWeight: 600 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  ltr,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { ltr?: boolean }) {
  return (
    <input
      dir={ltr ? "ltr" : "rtl"}
      className="w-full px-3.5 py-2.5 text-[14.5px] focus:outline-none"
      style={{ ...inputStyle, textAlign: ltr ? "left" : "right" }}
      {...rest}
    />
  );
}

export function TextArea({
  rows = 4,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      dir="rtl"
      className="w-full px-3.5 py-2.5 text-[14.5px] leading-relaxed focus:outline-none"
      style={{ ...inputStyle, textAlign: "right", resize: "vertical" }}
      {...rest}
    />
  );
}

export function Select({
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      dir="rtl"
      className="w-full px-3.5 py-2.5 text-[14.5px] focus:outline-none"
      style={{ ...inputStyle, textAlign: "right" }}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className="mb-4 flex cursor-pointer items-start gap-3"
      style={{ opacity: disabled ? 0.55 : 1 }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative mt-0.5 h-6 w-11 flex-shrink-0 transition-colors"
        style={{
          borderRadius: 999,
          background: checked ? "var(--green-600)" : "var(--stone-300)",
        }}
      >
        <span
          className="absolute top-0.5 block h-5 w-5 bg-white transition-all"
          style={{ borderRadius: 999, insetInlineStart: checked ? 22 : 2 }}
        />
      </button>
      <span>
        <span className="block text-[14px]" style={{ fontWeight: 700, color: "var(--ink-900)" }}>
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-[12.5px]" style={{ color: "var(--ink-600)" }}>
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// רשימה שאפשר להוסיף, למחוק ולסדר בה פריטים
// ---------------------------------------------------------------------------

export function RepeaterList<T>({
  items,
  onChange,
  makeEmpty,
  renderItem,
  addLabel,
  itemLabel,
  max,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  makeEmpty: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel: string;
  itemLabel?: (item: T, index: number) => string;
  max?: number;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  };

  return (
    <div>
      {items.length === 0 && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--ink-600)" }}>
          עדיין אין פריטים.
        </p>
      )}

      <ol className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="overflow-hidden"
            style={{ border: "1px solid var(--stone-100)", borderRadius: 12 }}
          >
            <div
              className="flex items-center justify-between gap-2 px-4 py-2"
              style={{ background: "var(--green-50)" }}
            >
              <span className="text-[13px]" style={{ fontWeight: 700, color: "var(--ink-600)" }}>
                {itemLabel ? itemLabel(item, i) : `פריט ${i + 1}`}
              </span>
              <div className="flex items-center gap-1">
                <IconButton
                  label="הזזה למעלה"
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="הזזה למטה"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, i + 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="מחיקה"
                  danger
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
            <div className="px-4 py-4">
              {renderItem(
                item,
                (patch) =>
                  onChange(items.map((row, j) => (j === i ? { ...row, ...patch } : row))),
                i,
              )}
            </div>
          </li>
        ))}
      </ol>

      {(max === undefined || items.length < max) && (
        <Button
          type="button"
          className="mt-3"
          onClick={() => onChange([...items, makeEmpty()])}
        >
          <Plus className="h-4 w-4" aria-hidden />
          {addLabel}
        </Button>
      )}
    </div>
  );
}

export function IconButton({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-35"
      style={{
        borderRadius: 8,
        border: "1px solid var(--stone-300)",
        background: "#fff",
        color: danger ? "#B4231C" : "var(--ink-600)",
      }}
    >
      {children}
    </button>
  );
}

/** פס שמירה דביק בתחתית המסך — כדי שלא צריך לגלול חזרה למעלה. */
export function SaveBar({
  dirty,
  saving,
  onSave,
  onReset,
  note,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onReset?: () => void;
  note?: string;
}) {
  return (
    <div
      className="sticky bottom-0 z-20 -mx-4 mt-8 flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:-mx-8 md:px-8"
      style={{
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid var(--stone-100)",
      }}
    >
      <span className="text-[13px]" style={{ color: "var(--ink-600)" }}>
        {note ?? (dirty ? "יש שינויים שלא נשמרו" : "הכל שמור")}
      </span>
      <div className="flex items-center gap-2">
        {onReset && dirty && (
          <Button type="button" variant="ghost" onClick={onReset}>
            ביטול שינויים
          </Button>
        )}
        <Button type="button" variant="primary" loading={saving} disabled={!dirty} onClick={onSave}>
          שמירה
        </Button>
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warn" | "muted";
}) {
  const tones: Record<string, React.CSSProperties> = {
    neutral: { background: "var(--green-100)", color: "var(--green-700)" },
    success: { background: "#E6F4EA", color: "#1E6B3A" },
    warn: { background: "var(--cream-100)", color: "var(--gold-ink)" },
    muted: { background: "var(--stone-100)", color: "var(--ink-600)" },
  };
  return (
    <span
      className="inline-block px-2.5 py-1 text-[12px]"
      style={{ ...tones[tone], borderRadius: 999, fontWeight: 700 }}
    >
      {children}
    </span>
  );
}
