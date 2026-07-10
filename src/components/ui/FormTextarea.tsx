import { splitProps, type JSX } from "solid-js";

interface FormTextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  class?: string;
}

const baseClass =
  "w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-slate-300 disabled:opacity-40 resize-none min-h-[70px] mac-scrollbar";

export function FormTextarea(props: FormTextareaProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <textarea class={`${baseClass} ${local.class || ""}`} {...rest} />;
}
