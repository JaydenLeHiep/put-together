import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { sendPurchaseNotificationEmail } from "../../services/emailService";

// ─────────────────────────────────────────────
// Bank account details — edit these constants
// ─────────────────────────────────────────────
const BANK_NAME = "Raiffeisenbank Österreich";
const IBAN = "AT12 3456 7890 1234 5678";
const BIC = "RZOOAT2L";
const ACCOUNT_HOLDER = "Lila Deutsch Sprach Zentrum GmbH";

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// CopyButton helper
// ─────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 rounded-lg border border-lila-200 bg-lila-50 px-2 py-1 text-xs font-semibold text-lila-600 transition hover:bg-lila-100"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Kopiert!" : "Kopieren"}
    </button>
  );
}

// ─────────────────────────────────────────────
// CheckoutModal
// ─────────────────────────────────────────────

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Called after successful confirmation (cart is cleared by the modal) */
  onSuccess: () => void;
};

type Step = "instructions" | "sending" | "success" | "error";

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<Step>("instructions");
  const [errorMsg, setErrorMsg] = useState("");

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "sending") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, onClose, step]);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) setStep("instructions");
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0);

  const handleConfirm = async () => {
    setStep("sending");
    try {
      await sendPurchaseNotificationEmail({
        studentName:  user.userName,
        studentEmail: user.email,
        courses:      items,
      });
      clearCart();
      setStep("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
      setStep("error");
    }
  };

  const handleSuccessClose = () => {
    setStep("instructions");
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-lila-950/50 backdrop-blur-md"
        onClick={step !== "sending" ? onClose : undefined}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-white shadow-2xl shadow-lila-900/20">

        {/* ── Header ── */}
        <div className="relative overflow-hidden bg-lila-700 px-7 py-6 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-lila-400 opacity-25 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Kasse
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight">
                {step === "success" ? "Bestellung bestätigt!" : "Banküberweisung"}
              </h2>
            </div>
            {step !== "sending" && (
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-7 py-6">

          {/* ─ INSTRUCTIONS STEP ─ */}
          {step === "instructions" && (
            <>
              {/* Cart summary */}
              <div className="mb-5 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.courseId}
                    className="flex items-center justify-between rounded-xl border border-lila-100 bg-lila-50/50 px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">{item.title}</p>
                      <p className="text-xs text-lila-500">{item.level}</p>
                    </div>
                    <span className="ml-4 shrink-0 text-sm font-black text-gray-700">
                      {item.price !== null ? `€${item.price}` : "Preis auf Anfrage"}
                    </span>
                  </div>
                ))}

                {total > 0 && (
                  <div className="flex items-center justify-between border-t border-lila-100 pt-3">
                    <span className="text-sm font-semibold text-gray-600">Gesamt</span>
                    <span className="text-base font-black text-lila-700">€{total.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Bank details */}
              <div className="rounded-2xl border border-lila-100 bg-lila-50/40 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-lila-500">
                  Bankverbindung
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Empfänger", value: ACCOUNT_HOLDER },
                    { label: "Bank", value: BANK_NAME },
                    { label: "IBAN", value: IBAN, copy: true },
                    { label: "BIC", value: BIC, copy: true },
                  ].map(({ label, value, copy }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-gray-500">{label}</span>
                      <div className="flex items-center">
                        <span className="font-mono text-xs font-semibold text-gray-800">{value}</span>
                        {copy && <CopyButton text={value} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference instruction */}
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-semibold text-amber-800">
                  <span className="font-black">Verwendungszweck:</span>{" "}
                  Bitte geben Sie Ihre E-Mail-Adresse{" "}
                  <span className="rounded bg-amber-100 px-1 font-mono font-black text-amber-900">
                    {user.email}
                  </span>{" "}
                  als Verwendungszweck an, damit wir die Zahlung zuordnen können.
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Nach Ihrer Überweisung klicken Sie auf{" "}
                <strong className="text-gray-700">„Bestellung absenden"</strong>. Wir erhalten
                dann eine Benachrichtigung und schalten den Kurs für Sie frei, sobald der
                Eingang bestätigt ist.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 rounded-xl bg-lila-700 py-2.5 text-sm font-bold text-white shadow-lg shadow-lila-200 transition hover:bg-lila-800"
                >
                  Bestellung absenden
                </button>
              </div>
            </>
          )}

          {/* ─ SENDING STEP ─ */}
          {step === "sending" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lila-50 text-lila-600">
                <SpinnerIcon />
              </div>
              <div>
                <p className="font-bold text-gray-900">Bestellung wird übermittelt…</p>
                <p className="mt-1 text-sm text-gray-500">Bitte warten Sie einen Moment.</p>
              </div>
            </div>
          )}

          {/* ─ SUCCESS STEP ─ */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lila-700 text-white shadow-lg shadow-lila-200">
                <CheckIcon />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">Vielen Dank!</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Wir haben Ihre Bestellung erhalten und werden Ihnen eine
                  Bestätigung an{" "}
                  <span className="font-semibold text-gray-700">{user.email}</span>{" "}
                  senden, sobald der Kurs freigeschaltet ist.
                </p>
              </div>
              <button
                onClick={handleSuccessClose}
                className="mt-2 w-full rounded-xl bg-lila-700 py-2.5 text-sm font-bold text-white shadow-lg shadow-lila-200 transition hover:bg-lila-800"
              >
                Schließen
              </button>
            </div>
          )}

          {/* ─ ERROR STEP ─ */}
          {step === "error" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <CloseIcon />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">Fehler aufgetreten</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {errorMsg || "Die Bestellung konnte nicht übermittelt werden."}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
                </p>
              </div>
              <div className="mt-2 flex w-full gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Schließen
                </button>
                <button
                  onClick={() => setStep("instructions")}
                  className="flex-1 rounded-xl bg-lila-700 py-2.5 text-sm font-bold text-white shadow-lg shadow-lila-200 transition hover:bg-lila-800"
                >
                  Erneut versuchen
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}