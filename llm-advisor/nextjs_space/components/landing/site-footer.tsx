import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Link href="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span>LLM Advisor</span>
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <li><Link href="/#problem" className="hover:text-foreground">Problem</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-foreground">How it works</Link></li>
              <li><Link href="/#persona" className="hover:text-foreground">Who it&rsquo;s for</Link></li>
              <li><Link href="/decision" className="hover:text-foreground">Start</Link></li>
            </ul>
          </nav>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          © {year} LLM Advisor · BAIS:3300 · Sprint 1 · John Kirima · University of Iowa
        </p>
      </div>
    </footer>
  )
}
