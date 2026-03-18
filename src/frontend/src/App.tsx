import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Participant {
  id: string;
  name: string;
  emoji: string;
  colorClass: string;
  avatarBg: string;
  shadowColor: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: "square" | "circle";
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PARTICIPANTS: Participant[] = [
  {
    id: "floeggi",
    name: "Flöggi",
    emoji: "🤙",
    colorClass: "bg-floeggi",
    avatarBg: "oklch(0.64 0.18 38)",
    shadowColor: "oklch(0.64 0.18 38 / 0.4)",
  },
  {
    id: "saft",
    name: "Saft",
    emoji: "🍊",
    colorClass: "bg-saft",
    avatarBg: "oklch(0.72 0.16 58)",
    shadowColor: "oklch(0.72 0.16 58 / 0.4)",
  },
  {
    id: "zeus",
    name: "Zeus",
    emoji: "⚡",
    colorClass: "bg-zeus",
    avatarBg: "oklch(0.40 0.13 263)",
    shadowColor: "oklch(0.40 0.13 263 / 0.4)",
  },
];

const DESTINATIONS = [
  { name: "Malaga", emoji: "🌊", flag: "🇪🇸", desc: "Sonne, Tapas & Strand!" },
  { name: "Mallorca", emoji: "🏖️", flag: "🇪🇸", desc: "Balearen-Feeling pur!" },
  { name: "Valencia", emoji: "🌴", flag: "🇪🇸", desc: "Paella & Party!" },
];

const CONFETTI_COLORS = [
  "oklch(0.64 0.18 38)",
  "oklch(0.72 0.16 58)",
  "oklch(0.40 0.13 263)",
  "oklch(0.82 0.14 82)",
  "oklch(0.70 0.16 50)",
  "oklch(0.85 0.12 160)",
  "oklch(0.75 0.15 300)",
];

const STEPS = [
  { id: "enter", emoji: "✏️", text: "Zahl eingeben" },
  { id: "random", emoji: "🎲", text: "Zufall entscheidet" },
  { id: "pack", emoji: "✈️", text: "Koffer packen!" },
];

function isValidNumber(v: string): boolean {
  return v.trim() !== "" && !Number.isNaN(Number(v));
}

// ─── Confetti Component ───────────────────────────────────────────────────────

function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    const generated: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 12 + 6,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 1.5,
      shape: Math.random() > 0.5 ? "square" : "circle",
    }));
    setPieces(generated);
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationFillMode: "forwards",
          }}
        />
      ))}
    </div>
  );
}

// ─── Participant Card ─────────────────────────────────────────────────────────

interface ParticipantCardProps {
  participant: Participant;
  value: string;
  onChange: (v: string) => void;
  index: number;
}

function ParticipantCard({
  participant,
  value,
  onChange,
  index,
}: ParticipantCardProps) {
  const [focused, setFocused] = useState(false);
  const filled = isValidNumber(value);

  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 ${participant.colorClass}`}
      style={{
        boxShadow:
          focused || filled
            ? `0 12px 40px ${participant.shadowColor}`
            : "0 4px 20px rgba(0,0,0,0.2)",
        transform: focused
          ? "translateY(-4px) scale(1.02)"
          : "translateY(0) scale(1)",
      }}
    >
      {filled && (
        <div
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold animate-bounce-in"
          style={{ color: participant.avatarBg }}
        >
          ✓
        </div>
      )}

      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white border-4 border-white/30 animate-float"
        style={{
          background: "rgba(255,255,255,0.25)",
          animationDelay: `${index * 0.5}s`,
        }}
      >
        {participant.emoji}
      </div>

      <h3 className="text-xl font-black text-white tracking-wide">
        {participant.name}
      </h3>

      <div className="w-full">
        <label
          className="block text-white/80 text-sm font-semibold mb-2 text-center"
          htmlFor={`input-${participant.id}`}
        >
          Deine Zahl:
        </label>
        <input
          id={`input-${participant.id}`}
          data-ocid={`${participant.id}.input`}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Gib eine Zahl ein"
          className="w-full rounded-xl px-4 py-3 text-center text-lg font-bold outline-none transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.9)",
            color: participant.avatarBg,
            border: filled ? "3px solid white" : "3px solid transparent",
            boxShadow: focused ? "0 0 0 3px rgba(255,255,255,0.5)" : "none",
          }}
        />
      </div>
    </div>
  );
}

// ─── Result Modal ─────────────────────────────────────────────────────────────

interface ResultModalProps {
  destination: (typeof DESTINATIONS)[0] | null;
  onReset: () => void;
}

function ResultModal({ destination, onReset }: ResultModalProps) {
  if (!destination) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{
        background: "rgba(11,127,174,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        data-ocid="result.modal"
        className="animate-pop-in relative rounded-3xl p-8 max-w-md w-full text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.67 0.09 192), oklch(0.55 0.10 200))",
          border: "4px solid oklch(0.70 0.16 50)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.4), 0 0 40px oklch(0.82 0.14 82 / 0.4)",
        }}
      >
        <div
          className="absolute -top-6 -left-6 text-4xl animate-float"
          style={{ animationDelay: "0s" }}
        >
          ✨
        </div>
        <div
          className="absolute -top-4 -right-8 text-3xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          🎊
        </div>
        <div
          className="absolute -bottom-6 -left-8 text-3xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          🎉
        </div>
        <div
          className="absolute -bottom-4 -right-6 text-4xl animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          ⭐
        </div>

        <p className="text-white/80 font-semibold text-lg mb-2">
          Euer Ferienziel ist...
        </p>

        <div className="my-6">
          <div className="text-6xl mb-3 animate-bounce">
            {destination.flag} {destination.emoji}
          </div>
          <h2
            className="text-5xl font-black text-white tracking-tight"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
          >
            {destination.name}
          </h2>
          <p className="text-white/90 font-semibold text-xl mt-2">
            {destination.desc}
          </p>
        </div>

        <div className="mt-2 mb-6 flex items-center justify-center gap-2 text-white/70 text-sm">
          <span>✈️</span>
          <span>Koffer packen &amp; los geht&#39;s!</span>
          <span>🌴</span>
        </div>

        <button
          type="button"
          data-ocid="result.button"
          onClick={onReset}
          className="w-full py-4 rounded-2xl text-lg font-black transition-all duration-200 active:scale-95 hover:scale-105 animate-pulse-glow"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.82 0.14 82), oklch(0.70 0.16 50))",
            color: "oklch(0.18 0.03 220)",
          }}
        >
          Nochmal spielen 🎲
        </button>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [values, setValues] = useState({ floeggi: "", saft: "", zeus: "" });
  const [result, setResult] = useState<(typeof DESTINATIONS)[0] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const hasTriggered = useRef(false);

  const allFilled =
    isValidNumber(values.floeggi) &&
    isValidNumber(values.saft) &&
    isValidNumber(values.zeus);

  const triggerRandomization = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * DESTINATIONS.length);
      setResult(DESTINATIONS[idx]);
      setIsCalculating(false);
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000);
    }, 1800);
  }, []);

  useEffect(() => {
    if (allFilled && !result && !isCalculating && !hasTriggered.current) {
      hasTriggered.current = true;
      triggerRandomization();
    }
  }, [allFilled, result, isCalculating, triggerRandomization]);

  const handleReset = () => {
    setValues({ floeggi: "", saft: "", zeus: "" });
    setResult(null);
    setIsCalculating(false);
    setConfettiActive(false);
    hasTriggered.current = false;
  };

  const updateValue = (id: string, val: string) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <div className="min-h-screen bg-hero font-poppins flex flex-col">
      <Confetti active={confettiActive} />
      <ResultModal destination={result} onReset={handleReset} />

      <header className="pt-12 pb-8 px-4 text-center">
        <div className="text-5xl mb-4 animate-float">✈️</div>
        <h1
          className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
        >
          Ferien
          <span
            className="block md:inline"
            style={{ color: "oklch(0.82 0.14 82)" }}
          >
            {" "}
            Zufallsgenerator
          </span>
        </h1>
        <p className="mt-3 text-white/80 text-lg md:text-xl font-semibold">
          🎲 Wer entscheidet wohin? Der Zufall!
        </p>
        <div className="mt-4 flex justify-center gap-3 text-white/60 text-sm font-medium">
          <span>🌊 Malaga</span>
          <span>•</span>
          <span>🏖️ Mallorca</span>
          <span>•</span>
          <span>🌴 Valencia</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-12">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-6 md:p-8"
          style={{
            background: "oklch(0.67 0.09 198 / 0.7)",
            backdropFilter: "blur(12px)",
            border: "2px solid rgba(255,255,255,0.2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              🧑‍🤝‍🧑 Reisen mit den Broskies
            </h2>
            <p className="text-white/70 mt-1 font-medium">
              Jeder gibt eine Zahl ein – der Rest ist Schicksal!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {PARTICIPANTS.map((p, i) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                value={values[p.id as keyof typeof values]}
                onChange={(v) => updateValue(p.id, v)}
                index={i}
              />
            ))}
          </div>

          <div className="text-center">
            {isCalculating ? (
              <div
                data-ocid="app.loading_state"
                className="py-5 px-8 rounded-2xl inline-flex items-center gap-3 text-lg font-bold"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                <span
                  className="inline-block"
                  style={{ animation: "spin-slow 1s linear infinite" }}
                >
                  🎲
                </span>
                <span>Berechne Zufallsziel...</span>
              </div>
            ) : (
              <button
                type="button"
                data-ocid="app.primary_button"
                disabled={!allFilled}
                onClick={allFilled ? triggerRandomization : undefined}
                className="py-4 px-10 rounded-2xl text-lg font-black transition-all duration-300"
                style={{
                  background: allFilled
                    ? "linear-gradient(135deg, oklch(0.82 0.14 82), oklch(0.70 0.16 50))"
                    : "rgba(255,255,255,0.15)",
                  color: allFilled
                    ? "oklch(0.18 0.03 220)"
                    : "rgba(255,255,255,0.5)",
                  cursor: allFilled ? "pointer" : "not-allowed",
                  border: allFilled
                    ? "none"
                    : "2px dashed rgba(255,255,255,0.3)",
                  boxShadow: allFilled
                    ? "0 8px 30px oklch(0.82 0.14 82 / 0.5)"
                    : "none",
                  transform: allFilled ? "scale(1)" : "scale(0.98)",
                }}
              >
                {allFilled
                  ? "🎲 Ziel bestimmen!"
                  : "Alle müssen eine Zahl eingeben..."}
              </button>
            )}

            <div className="mt-5 flex justify-center gap-3">
              {PARTICIPANTS.map((p) => {
                const v = values[p.id as keyof typeof values];
                const ok = isValidNumber(v);
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300"
                    style={{
                      background: ok ? p.avatarBg : "rgba(255,255,255,0.1)",
                      color: ok ? "white" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <span>{ok ? "✓" : "○"}</span>
                    <span>{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-6 grid grid-cols-3 gap-4 text-center">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="rounded-2xl py-4 px-3"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <div className="text-3xl mb-1">{step.emoji}</div>
              <p className="text-white/80 text-sm font-semibold">{step.text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-5 text-center">
        <p className="text-white/50 text-sm">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white underline transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
