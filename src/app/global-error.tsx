"use client";

/** Last-resort error boundary for the root layout. Inline styles because global CSS may not have loaded. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f7f5f2", color: "#1a1a1a", fontFamily: "Inter, system-ui, sans-serif", fontWeight: 300 }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#b8975a", margin: 0 }}>Jay Real Estate</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 48, margin: "16px 0 0" }}>Something went wrong</h1>
            <p style={{ color: "#6b6b6b", maxWidth: 420, margin: "16px auto 0", lineHeight: 1.6, fontSize: 14 }}>
              An unexpected error occurred. Please try again.
              {error.digest ? ` Reference ${error.digest}.` : ""}
            </p>
            <button
              onClick={reset}
              style={{ marginTop: 40, border: "1px solid #1a1a1a", background: "#1a1a1a", color: "#fff", padding: "14px 28px", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
