import type { JSX } from "solid-js";

interface MaintenanceActionProps {
  title: string;
  children: JSX.Element;
}

export function MaintenanceAction(props: MaintenanceActionProps) {
  return (
    <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold text-slate-300">{props.title}</p>
      </div>
      {props.children}
    </div>
  );
}