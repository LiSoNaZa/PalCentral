import { splitProps, type JSX } from "solid-js";

interface FormInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string;
}

const baseClass =
  "w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-slate-300 disabled:opacity-40";

export function FormInput(props: FormInputProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <input class={`${baseClass} ${local.class || ""}`} {...rest} />;
}
