import type { JSX } from "solid-js";

interface CardProps {
  title: string;
  subtitle?: string;
  titleColorClass?: string;
  extraHeaderElement?: JSX.Element;
  class?: string;
  children: JSX.Element;
}

export function DashboardCard(props: CardProps) {
  return (
    <section class={`bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col min-h-0 ${props.class || ""}`}>
      <div class="flex items-center justify-between mb-2 shrink-0">
        <h2 class={`text-xs font-bold uppercase tracking-wider ${props.titleColorClass || "text-blue-400"}`}>
          {props.title}
        </h2>
        {props.extraHeaderElement}
      </div>
      <div class="flex-1 overflow-y-auto pr-1 min-h-0 space-y-2">
        {props.subtitle && (
          <p class="text-[10px] text-slate-600 shrink-0 font-mono">{props.subtitle}</p>
        )}
        {props.children}
      </div>
    </section>
  );
}