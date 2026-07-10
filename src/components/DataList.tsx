import { For } from "solid-js";

export interface DataListItem {
  label: string;
  value: string | number;
  colorClass?: string;
}

interface DataListProps {
  items: DataListItem[];
}

export function DataList(props: DataListProps) {
  return (
    <div class="space-y-1.5 font-mono text-xs">
      <For each={props.items}>
        {(item) => (
          <div class="flex items-center justify-between p-2 bg-slate-900/60 border border-slate-800/50 rounded-lg hover:border-slate-700/50 transition-colors">
            <span class="text-slate-400 font-sans font-medium">{item.label}</span>
            <span class={`font-bold ${item.colorClass || "text-slate-200"} text-right max-w-[70%] truncate`}>
              {item.value}
            </span>
          </div>
        )}
      </For>
    </div>
  );
}