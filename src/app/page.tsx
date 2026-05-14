export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 md:px-8">
      <div className="max-w-lg w-full">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
            DesignPulse
          </h1>
          <p className="text-xl font-bold text-foreground leading-snug">
            AI-curated design intelligence for product designers
          </p>
        </header>
        <section>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            We&apos;re building a smarter way to stay current with how AI is reshaping product design. No noise, no inspiration-only feeds — just the signal that matters.
          </p>
          <p className="text-sm text-muted-foreground">
            Coming soon — launching in 2026
          </p>
        </section>
      </div>
    </main>
  );
}
