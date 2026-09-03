import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, BrainCircuit, Check, ChevronDown, CircleDollarSign, Gauge, Layers3, LockKeyhole, Menu, MoveRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Link } from 'wouter';

function Reveal({ children, className = '', delay = '' }: { children: ReactNode; className?: string; delay?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`landing-reveal ${visible ? 'is-visible' : ''} ${delay} ${className}`}>{children}</div>;
}

function RescueMark({ light = false }: { light?: boolean }) {
  return <span className="flex items-center gap-2.5" data-testid="brand-landing">
    <span className={`grid size-9 place-items-center rounded-[11px] ${light ? 'bg-primary text-primary-foreground' : 'bg-[hsl(190_27%_15%)] text-primary'}`}>
      <CircleDollarSign size={19} strokeWidth={2.3} />
    </span>
    <span className={`landing-display text-[15px] font-bold tracking-[-.045em] ${light ? 'text-[hsl(46_28%_94%)]' : 'text-[hsl(190_27%_15%)]'}`}>Revenue Rescue<span className={light ? 'text-primary' : 'text-[hsl(172_34%_31%)]'}> AI</span></span>
  </span>;
}

function LandingNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="absolute inset-x-0 top-0 z-30 px-5 py-5 sm:px-8 lg:px-12" data-testid="landing-header">
    <div className="mx-auto flex max-w-[1320px] items-center justify-between">
      <Link href="/" onClick={close} data-testid="link-landing-logo"><RescueMark /></Link>
      <nav className="hidden items-center gap-8 text-[11px] font-bold text-[hsl(190_15%_43%)] lg:flex" aria-label="Public navigation">
        <a href="#recovery-loop" className="landing-nav-link" data-testid="link-nav-recovery-loop">The loop</a>
        <a href="#outcomes" className="landing-nav-link" data-testid="link-nav-outcomes">Outcomes</a>
        <a href="#explainable" className="landing-nav-link" data-testid="link-nav-explainable">Explainable AI</a>
        <a href="#about" className="landing-nav-link" data-testid="link-nav-about">About</a>
      </nav>
      <div className="hidden items-center gap-5 lg:flex">
        <Link href="/dashboard" data-testid="link-landing-sign-in" className="landing-nav-link text-[11px] font-bold text-[hsl(190_15%_43%)]">Open dashboard</Link>
        <Link href="/dashboard" data-testid="button-landing-nav-cta" className="landing-button rounded-full bg-[hsl(190_27%_15%)] px-5 py-3 text-[11px] font-bold text-[hsl(46_28%_94%)]">See it in action <MoveRight className="ml-1 inline" size={14} /></Link>
      </div>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-landing-menu" className="rounded-full border border-[hsl(190_27%_15%_/.14)] p-2.5 lg:hidden">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
    </div>
    {open && <div className="landing-card mt-4 rounded-2xl p-4 lg:hidden" data-testid="landing-mobile-menu">
      <nav className="flex flex-col gap-1 text-[12px] font-bold">
        <a href="#recovery-loop" onClick={close} className="rounded-xl px-3 py-3 hover:bg-[hsl(43_23%_89%)]" data-testid="link-mobile-recovery-loop">The loop</a>
        <a href="#outcomes" onClick={close} className="rounded-xl px-3 py-3 hover:bg-[hsl(43_23%_89%)]" data-testid="link-mobile-outcomes">Outcomes</a>
        <a href="#explainable" onClick={close} className="rounded-xl px-3 py-3 hover:bg-[hsl(43_23%_89%)]" data-testid="link-mobile-explainable">Explainable AI</a>
        <Link href="/dashboard" onClick={close} className="mt-2 rounded-xl bg-[hsl(190_27%_15%)] px-3 py-3 text-center text-[hsl(46_28%_94%)]" data-testid="link-mobile-dashboard">Open live dashboard</Link>
      </nav>
    </div>}
  </header>;
}

function SignalConsole() {
  return <div className="landing-dark landing-grid landing-signal-console relative overflow-hidden rounded-[26px] p-4 shadow-[0_30px_80px_hsl(190_27%_15%_/.18)] sm:p-6" data-testid="visual-signal-console">
    <div className="landing-hero-glow pointer-events-none absolute inset-0" />
    <div className="relative flex items-center justify-between border-b border-[hsl(46_28%_94%_/.14)] pb-4">
      <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[hsl(166_51%_73%)]" /><span className="landing-mono text-[9px] uppercase tracking-[.16em] text-[hsl(46_28%_94%_/.58)]">rescue engine / live</span></div>
      <span className="landing-mono text-[9px] text-[hsl(46_28%_94%_/.42)]">09:42:18 UTC</span>
    </div>
    <div className="relative py-8 sm:py-12">
      <div className="landing-mono text-[9px] uppercase tracking-[.17em] text-[hsl(46_28%_94%_/.42)]">Case RC-1042 · signal map</div>
      <div className="mt-3 flex items-end justify-between gap-3"><div className="landing-display text-4xl font-semibold tracking-[-.07em] text-[hsl(46_28%_94%)] sm:text-5xl">$1,240<span className="text-primary">.00</span></div><span className="mb-1 rounded-full border border-[hsl(166_51%_73%_/.36)] bg-[hsl(166_51%_73%_/.11)] px-2.5 py-1 text-[9px] font-bold text-[hsl(166_51%_73%)]">recoverable</span></div>
      <div className="relative mt-8 h-36">
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[hsl(46_28%_94%_/.18)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 145" preserveAspectRatio="none" aria-label="Recovery signal graph">
          <path className="landing-line-art" d="M0 111 C55 108 58 80 105 88 S147 123 184 89 S227 52 265 70 S303 103 335 65 S380 26 415 50 S458 64 520 14" stroke="hsl(39 86% 56%)" strokeWidth="2.5" />
          <path d="M0 111 C55 108 58 80 105 88 S147 123 184 89 S227 52 265 70 S303 103 335 65 S380 26 415 50 S458 64 520 14 L520 145 L0 145 Z" fill="url(#signalFill)" opacity=".2" />
          <defs><linearGradient id="signalFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d59c32" /><stop offset="1" stopColor="#d59c32" stopOpacity="0" /></linearGradient></defs>
          <circle cx="415" cy="50" r="5" fill="hsl(166 51% 73%)" /><circle cx="415" cy="50" r="10" fill="none" stroke="hsl(166 51% 73% / .3)" />
        </svg>
        <div className="landing-scan absolute left-[80%] top-0 h-full w-px bg-primary/80" />
        <div className="absolute right-[16%] top-2 rounded-md border border-[hsl(166_51%_73%_/.26)] bg-[hsl(190_27%_15%_/.82)] px-2 py-1 text-[9px] font-bold text-[hsl(166_51%_73%)]">92% confidence</div>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-[hsl(46_28%_94%_/.14)] pt-4">
        <div><div className="landing-mono text-[8px] uppercase text-[hsl(46_28%_94%_/.38)]">Next move</div><div className="mt-1 text-[10px] font-bold text-[hsl(46_28%_94%_/.82)]">Smart retry</div></div>
        <div><div className="landing-mono text-[8px] uppercase text-[hsl(46_28%_94%_/.38)]">Timing</div><div className="mt-1 text-[10px] font-bold text-[hsl(46_28%_94%_/.82)]">In 36 hours</div></div>
        <div><div className="landing-mono text-[8px] uppercase text-[hsl(46_28%_94%_/.38)]">Guardrail</div><div className="mt-1 text-[10px] font-bold text-[hsl(166_51%_73%)]">No approval needed</div></div>
      </div>
    </div>
    <div className="landing-float absolute -right-3 top-[26%] hidden rounded-xl border border-[hsl(46_28%_94%_/.15)] bg-[hsl(190_27%_15%_/.8)] p-3 shadow-xl backdrop-blur-md sm:block" data-testid="visual-agent-note">
      <div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-lg bg-primary text-[hsl(190_27%_15%)]"><BrainCircuit size={13} /></span><span className="text-[9px] font-bold text-[hsl(46_28%_94%)]">Agent decision</span></div>
      <p className="mt-2 max-w-[145px] text-[9px] leading-4 text-[hsl(46_28%_94%_/.56)]">Timing matches this customer's usual cash-flow window.</p>
    </div>
  </div>;
}

function LandingPage() {
  return <div className="landing-page min-h-[100dvh]" data-testid="landing-page">
    <LandingNav />
    <main>
      <section className="landing-grid relative px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44 lg:px-12 lg:pt-52" data-testid="section-landing-hero">
        <div className="landing-hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">
           <div className="landing-hero-copy">
            <div className="landing-mono mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[hsl(172_34%_31%)]"><span className="size-2 rounded-full bg-[hsl(172_34%_31%)]" /> Revenue operations, rethought</div>
            <h1 className="landing-display max-w-4xl text-[clamp(4.1rem,9.5vw,9.5rem)] font-semibold leading-[.82] tracking-[-.095em]">Recover the<br /><span className="landing-serif font-normal italic text-[hsl(172_34%_31%)]">revenue</span> hiding<br />in plain sight.</h1>
            <p className="mt-9 max-w-[510px] text-[15px] leading-7 text-[hsl(190_15%_36%)] sm:text-[17px] sm:leading-8">Revenue Rescue AI turns failed payments into intelligent next moves — so your team recovers cash without chasing every decline.</p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link href="/dashboard" data-testid="button-hero-dashboard" className="landing-button inline-flex items-center gap-3 rounded-full bg-[hsl(190_27%_15%)] px-6 py-4 text-[12px] font-bold text-[hsl(46_28%_94%)]">Open the live dashboard <ArrowUpRight size={15} /></Link>
              <a href="#recovery-loop" data-testid="link-hero-how-it-works" className="landing-nav-link inline-flex items-center gap-2 px-1 text-[12px] font-bold text-[hsl(190_27%_15%)]">See how it works <ChevronDown size={15} /></a>
            </div>
            <div className="mt-12 flex items-center gap-5 border-t border-[hsl(190_27%_15%_/.14)] pt-5 text-[10px] font-bold text-[hsl(190_15%_43%)]"><span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[hsl(172_34%_31%)]" /> Policy-aware by design</span><span className="h-3 w-px bg-[hsl(190_27%_15%_/.18)]" /><span className="flex items-center gap-2"><LockKeyhole size={13} /> Explainable decisions</span></div>
          </div>
          <Reveal className="lg:pt-9" delay="landing-delay-2"><SignalConsole /></Reveal>
        </div>
        <div className="relative mx-auto mt-20 flex max-w-[1320px] items-center justify-between border-t border-[hsl(190_27%_15%_/.14)] pt-5"><span className="landing-mono text-[9px] uppercase tracking-[.19em] text-[hsl(190_15%_43%)]">Built for the moment after decline</span><span className="landing-mono hidden text-[9px] text-[hsl(190_15%_43%)] sm:block">scroll to explore ↓</span></div>
      </section>

      <section className="landing-dark relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-problem">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-28">
          <Reveal><div className="landing-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">01 / The leak</div><h2 className="landing-section-title landing-display mt-6 max-w-xl">A decline is<br /><span className="landing-serif font-normal italic text-[hsl(166_51%_73%)]">not</span> a dead end.</h2></Reveal>
          <Reveal delay="landing-delay-2" className="lg:pt-14"><p className="max-w-2xl text-[19px] leading-8 text-[hsl(46_28%_94%_/.74)] sm:text-[23px] sm:leading-9">Most payment systems stop at “failed.” They leave the context — the customer, the timing, the reason, the best next move — scattered across tools.</p><div className="mt-12 grid gap-4 sm:grid-cols-2"><div className="border-t border-[hsl(46_28%_94%_/.16)] pt-4"><div className="landing-stat-number text-5xl text-primary">68%</div><p className="mt-2 max-w-[190px] text-[11px] leading-5 text-[hsl(46_28%_94%_/.52)]">of failed payments are recoverable with the right intervention.</p></div><div className="border-t border-[hsl(46_28%_94%_/.16)] pt-4"><div className="landing-stat-number text-5xl text-[hsl(166_51%_73%)]">1.7×</div><p className="mt-2 max-w-[190px] text-[11px] leading-5 text-[hsl(46_28%_94%_/.52)]">more recovered revenue when timing and method change together.</p></div></div></Reveal>
        </div>
      </section>

      <section id="recovery-loop" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-recovery-loop">
        <div className="mx-auto max-w-[1320px]">
          <Reveal><div className="landing-mono text-[10px] font-bold uppercase tracking-[.2em] text-[hsl(172_34%_31%)]">02 / The recovery loop</div><div className="mt-6 flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><h2 className="landing-section-title landing-display max-w-3xl">From “failed” to<br /><span className="landing-serif font-normal italic text-[hsl(172_34%_31%)]">found money.</span></h2><p className="max-w-sm text-[13px] leading-6 text-[hsl(190_15%_43%)]">One operating system for the decisions that happen after the payment fails.</p></div></Reveal>
          <div className="mt-16 grid border-t border-[hsl(190_27%_15%_/.14)] md:grid-cols-4">
            {[['01', 'Listen', 'Connect payment events with customer, product, and timing signals.', Layers3], ['02', 'Reason', 'Score the real recovery path — not just the next retry.', BrainCircuit], ['03', 'Act', 'Execute the smallest useful move inside your guardrails.', Gauge], ['04', 'Learn', 'Feed outcomes back into the next decision automatically.', Sparkles]].map(([number, title, detail, Icon], index) => <Reveal key={number as string} delay={`landing-delay-${index + 1}`} className="border-b border-[hsl(190_27%_15%_/.14)] md:border-b-0 md:border-r md:last:border-r-0"><article className="group min-h-[270px] px-1 py-7 md:px-7 md:py-9" data-testid={`card-recovery-loop-${number}`}><div className="flex items-center justify-between"><span className="landing-mono text-[10px] text-[hsl(172_34%_31%)]">{number as string}</span><span className="grid size-9 place-items-center rounded-full border border-[hsl(190_27%_15%_/.14)] transition-colors group-hover:border-primary group-hover:bg-primary"><Icon size={16} /></span></div><h3 className="landing-display mt-14 text-2xl font-semibold tracking-[-.05em]">{title as string}</h3><p className="mt-3 max-w-[205px] text-[12px] leading-5 text-[hsl(190_15%_43%)]">{detail as string}</p></article></Reveal>)}
          </div>
        </div>
      </section>

      <section id="explainable" className="landing-dark relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-explainable">
        <div className="pointer-events-none absolute -right-20 top-16 size-[420px] rounded-full border border-[hsl(166_51%_73%_/.15)] sm:size-[620px]" /><div className="pointer-events-none absolute -right-4 top-32 size-[300px] rounded-full border border-[hsl(166_51%_73%_/.1)] sm:size-[470px]" />
        <div className="relative mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24">
          <Reveal><div className="landing-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">03 / Explainable by default</div><h2 className="landing-section-title landing-display mt-6">Every decision<br />has a <span className="landing-serif font-normal italic text-[hsl(166_51%_73%)]">why.</span></h2><p className="mt-8 max-w-lg text-[16px] leading-7 text-[hsl(46_28%_94%_/.62)]">AI should not be a black box between your payment failure and your finance report. Rescue shows the signals it weighed, the move it chose, and the confidence behind it.</p><Link href="/dashboard" data-testid="link-explainable-dashboard" className="landing-button mt-9 inline-flex items-center gap-2 rounded-full border border-[hsl(46_28%_94%_/.25)] px-5 py-3 text-[11px] font-bold text-[hsl(46_28%_94%)] hover:border-primary">Inspect the operating system <ArrowUpRight size={14} /></Link></Reveal>
          <Reveal delay="landing-delay-2"><div className="relative mx-auto w-full max-w-[510px] rounded-2xl border border-[hsl(46_28%_94%_/.15)] bg-[hsl(190_22%_22%_/.7)] p-5 backdrop-blur-sm" data-testid="card-explainable-decision"><div className="flex items-center justify-between border-b border-[hsl(46_28%_94%_/.13)] pb-4"><div className="flex items-center gap-2"><div className="grid size-8 place-items-center rounded-lg bg-primary text-[hsl(190_27%_15%)]"><BrainCircuit size={16} /></div><div><div className="text-[11px] font-bold">Recommendation rationale</div><div className="landing-mono mt-1 text-[8px] uppercase text-[hsl(46_28%_94%_/.4)]">case RC-1042</div></div></div><span className="landing-mono text-[10px] text-[hsl(166_51%_73%)]">92 / 100</span></div><p className="mt-5 text-[13px] leading-6 text-[hsl(46_28%_94%_/.74)]">“Retry after the customer’s usual renewal window. This account has recovered successfully after a 36-hour delay twice before.”</p><div className="mt-6 space-y-3">{[['Customer history', '2 prior successful recoveries', 'high'], ['Failure context', 'Temporary insufficient funds', 'medium'], ['Timing signal', 'Renewal window in 36 hours', 'high']].map(([label, value, level], index) => <div key={label} className="flex items-center gap-3 border-t border-[hsl(46_28%_94%_/.11)] pt-3" data-testid={`row-decision-signal-${index}`}><span className={`size-2 rounded-full ${level === 'high' ? 'bg-[hsl(166_51%_73%)]' : 'bg-primary'}`} /><div className="flex-1"><div className="text-[10px] font-bold">{label}</div><div className="mt-1 text-[10px] text-[hsl(46_28%_94%_/.48)]">{value}</div></div><Check size={14} className="text-[hsl(166_51%_73%)]" /></div>)}</div><div className="mt-6 rounded-xl bg-[hsl(166_51%_73%_/.1)] px-3.5 py-3 text-[10px] font-bold text-[hsl(166_51%_73%)]">Action is reversible · policy check passed</div></div></Reveal>
        </div>
      </section>

      <section id="outcomes" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-outcomes">
        <div className="mx-auto max-w-[1320px]">
          <Reveal><div className="landing-mono text-[10px] font-bold uppercase tracking-[.2em] text-[hsl(172_34%_31%)]">04 / The outcome</div><div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="landing-section-title landing-display max-w-3xl">The cash was<br /><span className="landing-serif font-normal italic text-[hsl(172_34%_31%)]">always there.</span></h2><p className="max-w-sm text-[13px] leading-6 text-[hsl(190_15%_43%)]">See the gap between repeating a retry and understanding what comes next.</p></div></Reveal>
          <Reveal delay="landing-delay-2" className="mt-14"><div className="grid border-y border-[hsl(190_27%_15%_/.14)] lg:grid-cols-[1.2fr_.8fr_1fr]"><div className="border-b border-[hsl(190_27%_15%_/.14)] py-8 lg:border-b-0 lg:border-r lg:pr-10"><div className="landing-mono text-[9px] uppercase tracking-[.17em] text-[hsl(190_15%_43%)]">Recovered this month</div><div className="landing-stat-number mt-4 text-7xl sm:text-8xl">$63.2k</div><div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-[hsl(172_34%_31%)]"><ArrowUpRight size={14} /> 18.4% over baseline</div></div><div className="border-b border-[hsl(190_27%_15%_/.14)] py-8 lg:border-b-0 lg:border-r lg:px-10"><div className="landing-mono text-[9px] uppercase tracking-[.17em] text-[hsl(190_15%_43%)]">Recovery rate</div><div className="landing-stat-number mt-4 text-7xl sm:text-8xl">74.9<span className="text-4xl">%</span></div><p className="mt-3 text-[11px] text-[hsl(190_15%_43%)]">from the same failure pool</p></div><div className="py-8 lg:pl-10"><div className="landing-mono text-[9px] uppercase tracking-[.17em] text-[hsl(190_15%_43%)]">Team time returned</div><div className="landing-stat-number mt-4 text-7xl sm:text-8xl">31<span className="text-4xl">h</span></div><p className="mt-3 text-[11px] text-[hsl(190_15%_43%)]">per month, no manual chasing</p></div></div></Reveal>
          <Reveal delay="landing-delay-3" className="mt-12 grid gap-4 md:grid-cols-3"><div className="landing-card rounded-2xl p-5"><div className="flex items-center gap-2 text-[11px] font-bold"><Check size={15} className="text-[hsl(172_34%_31%)]" /> More than retries</div><p className="mt-3 text-[12px] leading-5 text-[hsl(190_15%_43%)]">Switch timing, channel, and method based on what the customer is telling you.</p></div><div className="landing-card rounded-2xl p-5"><div className="flex items-center gap-2 text-[11px] font-bold"><Check size={15} className="text-[hsl(172_34%_31%)]" /> Less operational noise</div><p className="mt-3 text-[12px] leading-5 text-[hsl(190_15%_43%)]">The agent handles the repetitive decisions and escalates only what needs judgment.</p></div><div className="landing-card rounded-2xl p-5"><div className="flex items-center gap-2 text-[11px] font-bold"><Check size={15} className="text-[hsl(172_34%_31%)]" /> A cleaner audit trail</div><p className="mt-3 text-[12px] leading-5 text-[hsl(190_15%_43%)]">Every recommendation is explainable, reversible, and visible to your team.</p></div></Reveal>
        </div>
      </section>

      <section className="bg-[hsl(43_23%_89%)] px-5 py-20 sm:px-8 sm:py-24 lg:px-12" data-testid="section-trust">
        <Reveal className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><div className="landing-mono text-[9px] uppercase tracking-[.2em] text-[hsl(190_15%_43%)]">Quietly dependable infrastructure</div><p className="landing-display mt-4 max-w-xl text-2xl font-semibold tracking-[-.05em] sm:text-3xl">Built to make the right move — and show your team why.</p></div><div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[10px] font-bold text-[hsl(190_15%_43%)]"><span className="flex items-center gap-2"><ShieldCheck size={15} /> Guardrails first</span><span className="flex items-center gap-2"><LockKeyhole size={14} /> Secure by default</span><span className="flex items-center gap-2"><CircleDollarSign size={15} /> Cash accountable</span></div></Reveal>
      </section>

      <section className="landing-dark px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-dashboard-preview">
        <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <Reveal><div className="landing-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">05 / Your command center</div><h2 className="landing-display mt-6 text-5xl font-semibold leading-[.9] tracking-[-.075em] sm:text-6xl">See the<br /><span className="landing-serif font-normal italic text-[hsl(166_51%_73%)]">whole</span> picture.</h2><p className="mt-7 max-w-sm text-[14px] leading-6 text-[hsl(46_28%_94%_/.58)]">A live operating view for the revenue your existing stack leaves behind.</p><Link href="/dashboard" data-testid="link-dashboard-preview-cta" className="landing-button mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[11px] font-bold text-[hsl(190_27%_15%)]">Open dashboard <ArrowUpRight size={14} /></Link></Reveal>
          <Reveal delay="landing-delay-2"><div className="relative rounded-[20px] border border-[hsl(46_28%_94%_/.16)] bg-[hsl(46_28%_94%_/.06)] p-2 shadow-2xl" data-testid="visual-dashboard-preview"><div className="rounded-[14px] bg-[hsl(46_28%_94%)] p-3 text-[hsl(190_27%_15%)] sm:p-5"><div className="flex items-center justify-between border-b border-[hsl(190_27%_15%_/.1)] pb-4"><div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-lg bg-[hsl(190_27%_15%)] text-primary"><CircleDollarSign size={13} /></span><span className="landing-display text-[11px] font-bold">Revenue Rescue <span className="text-[hsl(172_34%_31%)]">AI</span></span></div><span className="landing-mono text-[8px] text-[hsl(190_15%_43%)]">LIVE OPERATIONS</span></div><div className="grid gap-3 py-5 sm:grid-cols-3"><div className="rounded-xl bg-[hsl(190_27%_15%)] p-3 text-[hsl(46_28%_94%)] sm:col-span-1"><div className="text-[8px] text-[hsl(46_28%_94%_/.55)]">Recovered this month</div><div className="landing-stat-number mt-2 text-3xl">$28.4k</div><div className="mt-2 text-[8px] text-[hsl(166_51%_73%)]">+12.8%</div></div><div className="rounded-xl border border-[hsl(190_27%_15%_/.11)] p-3"><div className="text-[8px] text-[hsl(190_15%_43%)]">Recovery rate</div><div className="landing-stat-number mt-2 text-3xl">74.9%</div><div className="mt-2 h-1 rounded-full bg-[hsl(43_23%_89%)]"><div className="h-full w-3/4 rounded-full bg-primary" /></div></div><div className="rounded-xl border border-[hsl(190_27%_15%_/.11)] p-3"><div className="text-[8px] text-[hsl(190_15%_43%)]">Active cases</div><div className="landing-stat-number mt-2 text-3xl">128</div><div className="mt-2 text-[8px] text-[hsl(190_15%_43%)]">12 new today</div></div></div><div className="rounded-xl border border-[hsl(190_27%_15%_/.11)] p-3"><div className="mb-3 flex items-center justify-between"><span className="text-[9px] font-bold">Recovery momentum</span><span className="landing-mono text-[8px] text-[hsl(190_15%_43%)]">MAY 06 — JUN 03</span></div><svg className="h-24 w-full" viewBox="0 0 600 100" preserveAspectRatio="none"><path d="M0 82 C65 79 85 55 130 67 S203 85 252 55 S324 58 365 63 S435 40 480 47 S550 24 600 20" fill="none" stroke="hsl(172 34% 31%)" strokeWidth="3" /><path d="M0 82 C65 79 85 55 130 67 S203 85 252 55 S324 58 365 63 S435 40 480 47 S550 24 600 20" fill="none" stroke="hsl(39 86% 56%)" strokeWidth="1" strokeDasharray="3 6" /></svg></div></div></div></Reveal>
        </div>
      </section>

      <section id="about" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-closing-quote">
        <Reveal className="mx-auto max-w-[1080px] text-center"><div className="landing-mono text-[10px] font-bold uppercase tracking-[.2em] text-[hsl(172_34%_31%)]">A better post-decline experience</div><blockquote className="landing-serif mt-8 text-[clamp(2.7rem,6vw,6.2rem)] leading-[.9] tracking-[-.045em]">“Revenue rescue is not a recovery tactic. It is a way of treating every payment signal like it matters.”</blockquote><div className="mt-8 text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(190_15%_43%)]">The Revenue Rescue principle</div></Reveal>
      </section>

      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12" data-testid="section-final-cta">
        <Reveal className="landing-dark landing-grid landing-grain relative mx-auto max-w-[1320px] overflow-hidden rounded-[28px] px-6 py-16 text-center sm:px-10 sm:py-24"><div className="landing-hero-glow pointer-events-none absolute inset-0" /><div className="relative"><div className="landing-mono text-[10px] font-bold uppercase tracking-[.2em] text-primary">Ready when the next payment fails</div><h2 className="landing-display mx-auto mt-6 max-w-3xl text-[clamp(3.5rem,8vw,8rem)] font-semibold leading-[.83] tracking-[-.09em]">Turn the next<br /><span className="landing-serif font-normal italic text-[hsl(166_51%_73%)]">decline</span> into momentum.</h2><p className="mx-auto mt-8 max-w-md text-[14px] leading-6 text-[hsl(46_28%_94%_/.58)]">Step into the live workspace and see what an explainable recovery decision looks like.</p><Link href="/dashboard" data-testid="button-final-dashboard" className="landing-button mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-[12px] font-bold text-[hsl(190_27%_15%)]">Enter Revenue Rescue AI <ArrowUpRight size={15} /></Link></div></Reveal>
      </section>
    </main>
    <footer className="border-t border-[hsl(190_27%_15%_/.14)] px-5 py-8 sm:px-8 lg:px-12" data-testid="landing-footer">
      <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-5 sm:flex-row sm:items-center"><RescueMark /><div className="flex items-center gap-5 text-[10px] font-bold text-[hsl(190_15%_43%)]"><a href="#recovery-loop" data-testid="link-footer-loop">The loop</a><a href="#outcomes" data-testid="link-footer-outcomes">Outcomes</a><Link href="/dashboard" data-testid="link-footer-dashboard">Dashboard <ArrowUpRight className="ml-1 inline" size={12} /></Link></div><div className="landing-mono text-[9px] text-[hsl(190_15%_43%)]">© 2026 Revenue Rescue AI</div></div>
    </footer>
  </div>;
}

export default LandingPage;