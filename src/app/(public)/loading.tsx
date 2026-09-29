import { Logo } from "@/components/ui/Logo";

export default function PublicLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white" role="status" aria-live="polite" aria-label="Loading">
      <div className="flex flex-col items-center">
        <Logo variant="dark" size="md" href={null} className="animate-pulse" />
        <span className="mt-8 block h-px w-12 overflow-hidden bg-line">
          <span className="block h-full w-1/2 animate-[shimmer_1.6s_var(--ease-luxury)_infinite] bg-gold" />
        </span>
      </div>
    </div>
  );
}
