import { For } from "solid-js";

export interface DataListItem {
  label: string;
  value: string | number;
  colorClass?: string;
  type?: 'newLine' | 'sameLine';
}

interface DataListProps {
  items: DataListItem[];
}

export function DataList(props: DataListProps) {
  return (
    <div class="space-y-1.5 font-mono text-xs">
      <For each={props.items}>
        {(item) => (
          <div class="flex justify-between p-2 bg-slate-900/60 border border-slate-800/50 rounded-lg hover:border-slate-700/50 transition-colors" classList={{'flex-col': item.type == 'newLine', 'items-center' : item.type !== 'newLine'}}>
            <span class="text-slate-400 font-sans font-medium">{item.label}</span>
            <span class={`font-bold ${item.colorClass || "text-slate-200"}`} classList={{'max-w-[100%] truncate': item.type == 'newLine', 'text-right max-w-[70%] truncate' : item.type !== 'newLine'}}>
              {item.value}
            </span>
          </div>
        )}
      </For>
    </div>
  );
}