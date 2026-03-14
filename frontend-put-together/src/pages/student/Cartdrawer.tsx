import { useState } from "react";
import { useCart } from "../../context/useCart";
import CheckoutModal from "./CheckoutModal";

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CartEmptyIcon() {
  return (
    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, totalCount } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-lila-950/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl shadow-lila-900/20 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-lila-700 px-6 py-5 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Warenkorb
              </p>
              <h2 className="mt-0.5 text-lg font-black">
                {totalCount === 0
                  ? "Leer"
                  : `${totalCount} ${totalCount === 1 ? "Kurs" : "Kurse"}`}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lila-50 text-lila-400">
                <CartEmptyIcon />
              </div>
              <p className="text-sm font-semibold text-gray-600">Ihr Warenkorb ist leer</p>
              <p className="text-xs text-gray-400">Fügen Sie Kurse hinzu, um fortzufahren.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.courseId}
                  className="flex items-start gap-3 rounded-2xl border border-lila-100 bg-white p-3 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-lila-50">
                    {item.courseThumbnailUrl ? (
                      <img
                        src={item.courseThumbnailUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lila-300">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold leading-tight text-gray-900">
                      {item.title}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-lila-50 px-2 py-0.5 text-xs font-semibold text-lila-600">
                      {item.level}
                    </span>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-sm font-black text-gray-700">
                      {item.price !== null ? `€${item.price}` : "—"}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.courseId)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-400 transition hover:bg-rose-100 hover:text-rose-600"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-lila-100 bg-white px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Gesamt</span>
              <span className="text-lg font-black text-lila-700">€{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full rounded-xl bg-lila-700 py-3 text-sm font-bold text-white shadow-lg shadow-lila-200 transition hover:bg-lila-800"
            >
              Zur Kasse →
            </button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false);
          onClose();
        }}
      />
    </>
  );
}