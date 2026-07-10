interface LoadingSpinnerProps {
  class?: string;
}

export function LoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <div
      class={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${props.class || "border-slate-300"}`}
    />
  );
}
