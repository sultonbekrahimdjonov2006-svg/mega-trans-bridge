import { Sparkles } from "lucide-react";

export function Avatar({ assistant = false }: { assistant?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${assistant ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-600"}`}
    >
      {assistant ? (
        <Sparkles size={16} />
      ) : (
        <span className="text-xs font-semibold">Вы</span>
      )}
    </div>
  );
}
