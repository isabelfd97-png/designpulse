export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 md:px-8 bg-background">
      <div className="max-w-lg w-full flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground tracking-tight">
            DesignPulse
          </h1>
          <p className="text-xl font-bold leading-snug text-foreground">
            AI-curated design intelligence for product designers
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <p className="text-base leading-relaxed text-foreground">
            We&apos;re building a smarter way to stay current with how AI is reshaping
            product design. No noise, no inspiration-only feeds — just the signal
            that matters.
          </p>
          <p className="text-sm text-muted-foreground">
            Coming soon — launching in 2026
          </p>
        </section>
      </div>
    </main>
  );
}
