export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center gap-5 px-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-neon-primary)] border-r-[var(--color-neon-primary)] animate-spin" />
      </div>
      <div className="text-[var(--color-text-secondary)] font-medium">
        Invocando el destino...
      </div>
    </div>
  );
}