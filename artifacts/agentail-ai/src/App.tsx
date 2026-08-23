import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Command,
  Compass,
  FileSearch,
  Menu,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'Why Agentail', href: '#mission' },
  { label: 'Digital teammates', href: '#agents' },
  { label: 'Field notes', href: '#field-notes' },
];

const faqItems = [
  {
    question: 'Is Agentail another chat window?',
    answer:
      'No. Agentail is built around outcomes, not conversations. Your teammates can research, draft, monitor, and hand work back with the context and sources attached.',
  },
  {
    question: 'What kind of work can I delegate?',
    answer:
      'Start with the work that steals focus: market scans, weekly reporting, lead research, content briefs, inbox triage, meeting prep, and the small operational loops that keep a team moving.',
  },
  {
    question: 'Do I need to know how to prompt?',
    answer:
      'Not at all. Give an agent a goal, a few guardrails, and the tools it can use. Agentail turns intent into a repeatable brief your teammate can run again.',
  },
  {
    question: 'Can my team keep control?',
    answer:
      'Always. Every action has a clear owner, a review point, and an audit trail. Agents suggest and execute within the boundaries you set.',
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function BrandMark() {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-[11px] bg-[var(--acid)] text-[var(--ink)]" aria-hidden="true">
      <span className="absolute -right-1 -top-2 h-5 w-5 rounded-full border-2 border-[var(--ink)]" />
      <span className="relative font-mono text-sm font-bold tracking-[-0.14em]">a_</span>
    </span>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#top"
      data-testid="link-logo"
      className={`group inline-flex items-center gap-3 ${light ? 'text-[var(--paper)]' : 'text-[var(--ink)]'}`}
    >
      <BrandMark />
      <span className="font-display text-[17px] font-bold tracking-[-0.04em]">
        agentail<span className="text-[var(--coral)]">.</span>ai
      </span>
    </a>
  );
}

function Header({ onStart }: { onStart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    scrollToId(href.slice(1));
  };

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-40 border-b border-transparent ${scrolled ? 'is-scrolled' : ''}`}
      data-testid="site-header"
    >
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleNav(item.href)}
              data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--ink-soft)] transition-colors hover:text-[var(--coral)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <button
            type="button"
            onClick={onStart}
            data-testid="button-header-start"
            className="group flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-[13px] font-bold text-[var(--paper)] transition-transform hover:-translate-y-0.5"
          >
            Start building
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          data-testid="button-mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="menu-panel mx-4 mb-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3 shadow-xl md:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleNav(item.href)}
              data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[var(--paper-deep)]"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onStart();
            }}
            data-testid="button-mobile-start"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-bold text-[var(--paper)]"
          >
            Start building <ArrowUpRight size={15} />
          </button>
        </div>
      )}
    </header>
  );
}

function Hero({ onStart, onTour }: { onStart: () => void; onTour: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-[var(--ink)] text-[var(--paper)]">
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div className="absolute -right-32 top-20 h-[460px] w-[460px] rounded-full bg-[var(--acid)] opacity-10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[780px] max-w-[1320px] items-center gap-14 px-5 pb-20 pt-36 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="reveal">
          <div className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--acid)]">
            <span className="h-2 w-2 rounded-full bg-[var(--acid)]" />
            The work layer for small teams
          </div>
          <h1 className="max-w-[680px] font-display text-[clamp(3.8rem,8vw,7.7rem)] font-bold leading-[0.88] tracking-[-0.085em]">
            Give the work
            <span className="block text-[var(--acid)]">a second brain.</span>
          </h1>
          <p className="mt-8 max-w-[480px] text-[17px] leading-7 text-[var(--paper)]/65 sm:text-[19px]">
            Agentail gives ambitious people digital teammates that take real work from brief to done — while you stay close to what matters.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              data-testid="button-hero-start"
              className="button-arrow group inline-flex items-center gap-3 rounded-full bg-[var(--acid)] px-6 py-4 text-sm font-bold text-[var(--ink)] transition-transform hover:-translate-y-1"
            >
              Put an agent to work <ArrowRight size={17} />
            </button>
            <button
              type="button"
              onClick={onTour}
              data-testid="button-hero-tour"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--paper)]/75 transition-colors hover:text-[var(--acid)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--paper)]/35 transition-colors group-hover:border-[var(--acid)]">
                <Play size={12} fill="currentColor" />
              </span>
              See the 90-second tour
            </button>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--paper)]/35">
            No credit card · private beta · built for humans
          </p>
        </div>

        <div className="reveal delay-2 relative lg:pl-5">
          <div className="absolute -left-5 top-8 hidden h-32 w-32 rounded-full border border-[var(--acid)]/25 lg:block" />
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--paper)]/15 bg-[var(--ink-soft)] shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between border-b border-[var(--paper)]/10 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2">
                <Command size={15} className="text-[var(--acid)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper)]/55">Command center</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--paper)]/40">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--acid)]" /> Live workspace
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <div className="rounded-2xl border border-[var(--paper)]/10 bg-[var(--ink)]/55 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--coral)] text-[var(--ink)]">
                    <span className="font-mono text-xs font-bold">you</span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper)]/35">Brief · Monday, 08:42</p>
                    <p className="mt-2 text-[15px] leading-6 text-[var(--paper)]/90">“Prep a launch brief for the product sync. Find the signal, not just the links.”</p>
                  </div>
                </div>
              </div>
              <div className="my-5 ml-4 h-7 border-l border-dashed border-[var(--paper)]/20" />
              <div className="space-y-3">
                <AgentProgress icon={<Compass size={16} />} label="Scout is reading 42 sources" status="Working" />
                <AgentProgress icon={<BrainCircuit size={16} />} label="Sift is finding the signal" status="Working" />
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--acid)]/35 bg-[var(--acid)]/10 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--acid)] text-[var(--ink)]">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-[var(--paper)]">Brief ready for your eyes</p>
                    <p className="mt-1 font-mono text-[10px] text-[var(--acid)]/70">5 key shifts · 3 decisions · sources attached</p>
                  </div>
                  <ArrowUpRight size={16} className="text-[var(--acid)]" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--paper)]/10 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--paper)]/35 sm:px-7">
              <span>Human review · always on</span>
              <span>08:57:12</span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-4 hidden w-48 rotate-3 rounded-2xl border border-[var(--ink)]/10 bg-[var(--acid)] p-4 text-[var(--ink)] shadow-xl sm:block">
            <Zap size={17} />
            <p className="mt-5 text-[13px] font-bold leading-5">Make space for the thinking only you can do.</p>
          </div>
        </div>
      </div>
      <div className="relative border-t border-[var(--paper)]/10">
        <div className="mx-auto flex max-w-[1320px] items-center gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--paper)]/35">A better default</span>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="marquee-track inline-flex min-w-max gap-8 font-display text-sm font-semibold text-[var(--paper)]/55">
              <span>Research that comes back clear</span><span className="text-[var(--acid)]">×</span><span>Operations that keep moving</span><span className="text-[var(--acid)]">×</span><span>Writing with a point of view</span><span className="text-[var(--acid)]">×</span>
              <span>Research that comes back clear</span><span className="text-[var(--acid)]">×</span><span>Operations that keep moving</span><span className="text-[var(--acid)]">×</span><span>Writing with a point of view</span><span className="text-[var(--acid)]">×</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentProgress({ icon, label, status }: { icon: ReactNode; label: string; status: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--paper)]/10 bg-[var(--paper)]/[0.035] p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--paper)]/10 text-[var(--blue-note)]">{icon}</div>
      <p className="min-w-0 flex-1 text-[13px] font-semibold text-[var(--paper)]/80">{label}</p>
      <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--paper)]/35">{status}</span>
    </div>
  );
}

function Mission() {
  return (
    <section id="mission" className="bg-[var(--paper)]">
      <div className="mx-auto grid max-w-[1320px] gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-40">
        <div className="reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--coral)]">01 / The shift</p>
          <h2 className="mt-6 max-w-[440px] font-display text-[clamp(2.8rem,5vw,5.2rem)] font-bold leading-[0.93] tracking-[-0.075em]">
            Your edge isn’t more hours.
          </h2>
          <p className="mt-7 max-w-[390px] text-[16px] leading-7 text-[var(--ink-soft)]/70">
            It’s judgment. Taste. Knowing what deserves a closer look. Agentail handles the useful, repeatable work so your best attention lands where it counts.
          </p>
          <a href="#agents" data-testid="link-mission-agents" className="arrow-link mt-8 inline-flex items-center gap-3 border-b border-[var(--ink)]/25 pb-2 text-sm font-bold">
            Meet your digital teammates <ArrowRight size={16} />
          </a>
        </div>
        <div className="relative reveal delay-1">
          <div className="absolute bottom-0 left-[21px] top-3 border-l border-dashed border-[var(--ink)]/20" />
          <div className="space-y-10">
            <MissionStep number="01" title="You set the direction." copy="Give a teammate a clear outcome, the context it needs, and the lines it shouldn’t cross." icon={<Compass size={20} />} />
            <MissionStep number="02" title="They do the legwork." copy="Agents search, sort, draft, check, and keep going across the tools your team already uses." icon={<Sparkles size={20} />} />
            <MissionStep number="03" title="You make the call." copy="Work comes back with the signal surfaced and the next move obvious. Your judgment stays in the loop." icon={<CircleDot size={20} />} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionStep({ number, title, copy, icon }: { number: string; title: string; copy: string; icon: ReactNode }) {
  return (
    <div className="relative flex gap-6 sm:gap-9">
      <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--ink)]/20 bg-[var(--paper)] text-[var(--coral)]">{icon}</div>
      <div className="pt-1">
        <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--ink)]/40">{number}</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.045em]">{title}</h3>
        <p className="mt-2 max-w-[480px] text-[15px] leading-6 text-[var(--ink-soft)]/65">{copy}</p>
      </div>
    </div>
  );
}

function Agents() {
  return (
    <section id="agents" className="overflow-hidden bg-[var(--paper-deep)]">
      <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="reveal">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--coral)]">02 / The roster</p>
            <h2 className="mt-6 max-w-[680px] font-display text-[clamp(3rem,6vw,6rem)] font-bold leading-[0.88] tracking-[-0.08em]">
              Small team.<br /><span className="text-[var(--coral)]">Larger orbit.</span>
            </h2>
          </div>
          <p className="reveal delay-1 max-w-[295px] text-[15px] leading-6 text-[var(--ink-soft)]/65">
            Start with one teammate. Build a crew around the work that keeps showing up.
          </p>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          <AgentCard className="lg:col-span-5 lg:mt-14" tone="blue" icon={<FileSearch size={22} />} eyebrow="The signal finder" name="Scout" description="Turns a wide-open question into a sharp read on what changed, what matters, and what to do next." tasks={['Market pulse', 'Competitor watch', 'Source-backed briefs']} />
          <AgentCard className="lg:col-span-4" tone="coral" icon={<Zap size={22} />} eyebrow="The momentum keeper" name="Operator" description="Moves the recurring pieces forward — from tidy CRM to clean handoffs — without needing a reminder." tasks={['Weekly reporting', 'Lead enrichment', 'Workflow upkeep']} />
          <AgentCard className="lg:col-span-3 lg:mt-28" tone="acid" icon={<BrainCircuit size={22} />} eyebrow="The clear voice" name="Scribe" description="Finds the words when the idea is still a pile of notes." tasks={['Briefs & memos', 'Launch copy', 'Meeting follow-ups']} />
        </div>
      </div>
    </section>
  );
}

function AgentCard({ className, tone, icon, eyebrow, name, description, tasks }: { className: string; tone: 'blue' | 'coral' | 'acid'; icon: ReactNode; eyebrow: string; name: string; description: string; tasks: string[] }) {
  const toneClass = {
    blue: 'bg-[var(--blue-note)]',
    coral: 'bg-[var(--coral)]',
    acid: 'bg-[var(--acid)]',
  }[tone];
  return (
    <article className={`agent-card flex min-h-[390px] flex-col justify-between rounded-[27px] border border-[var(--ink)]/10 p-6 sm:p-8 ${toneClass} ${className}`} data-testid={`card-agent-${name.toLowerCase()}`}>
      <div>
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--ink)]/15 bg-[var(--paper)]/35 text-[var(--ink)]">{icon}</div>
          <ArrowUpRight size={20} className="text-[var(--ink)]/55" />
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.17em] text-[var(--ink)]/55">{eyebrow}</p>
        <h3 className="mt-2 font-display text-4xl font-bold tracking-[-0.07em]">{name}</h3>
        <p className="mt-4 max-w-[330px] text-[15px] leading-6 text-[var(--ink)]/70">{description}</p>
      </div>
      <div className="mt-10 flex flex-wrap gap-2">
        {tasks.map((task) => <span key={task} className="rounded-full border border-[var(--ink)]/15 bg-[var(--paper)]/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--ink)]/70">{task}</span>)}
      </div>
    </article>
  );
}

function Workbench() {
  return (
    <section id="field-notes" className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-12 lg:py-40">
        <div className="reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--acid)]">03 / A quiet advantage</p>
          <h2 className="mt-6 max-w-[550px] font-display text-[clamp(3rem,5vw,5.8rem)] font-bold leading-[0.9] tracking-[-0.08em]">
            The work keeps moving while you zoom out.
          </h2>
          <p className="mt-7 max-w-[430px] text-[16px] leading-7 text-[var(--paper)]/60">
            Agentail is for the stretch between “we should” and “it’s handled.” A living layer of context, action, and follow-through.
          </p>
          <div className="mt-10 flex items-center gap-8">
            <div>
              <p className="font-display text-4xl font-bold tracking-[-0.07em] text-[var(--acid)]">7h 20m</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--paper)]/35">focus returned / week</p>
            </div>
            <div className="h-10 border-l border-[var(--paper)]/15" />
            <div>
              <p className="font-display text-4xl font-bold tracking-[-0.07em] text-[var(--paper)]">14</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--paper)]/35">loops off your plate</p>
            </div>
          </div>
        </div>
        <div className="reveal delay-2">
          <div className="overflow-hidden rounded-[26px] border border-[var(--paper)]/15 bg-[var(--paper)]/[0.055]">
            <div className="flex items-center justify-between border-b border-[var(--paper)]/10 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2">
                <Clock3 size={15} className="text-[var(--acid)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--paper)]/55">Before 09:00</span>
              </div>
              <span className="rounded-full bg-[var(--acid)]/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--acid)]">3 actions complete</span>
            </div>
            <div className="space-y-1 p-3 sm:p-5">
              <WorkRow time="06:48" title="Scout sent the Monday market pulse" detail="8 sources · 4 signals · 2 watch-outs" color="blue" />
              <WorkRow time="07:12" title="Operator cleaned 26 new leads" detail="Enriched, tagged, and routed to the right owner" color="acid" />
              <WorkRow time="08:31" title="Scribe shaped the launch brief" detail="Ready for review · 6 min read" color="coral" />
            </div>
            <div className="m-3 flex items-center gap-3 rounded-xl border border-dashed border-[var(--paper)]/15 p-4 sm:m-5">
              <Plus size={17} className="text-[var(--paper)]/35" />
              <span className="text-sm text-[var(--paper)]/45">Assign a new outcome</span>
              <span className="ml-auto font-mono text-[9px] text-[var(--paper)]/25">⌘ K</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkRow({ time, title, detail, color }: { time: string; title: string; detail: string; color: 'blue' | 'acid' | 'coral' }) {
  const dotClass = { blue: 'bg-[var(--blue-note)]', acid: 'bg-[var(--acid)]', coral: 'bg-[var(--coral)]' }[color];
  return (
    <div className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--paper)]/[0.05] sm:gap-5 sm:p-4">
      <span className="pt-1 font-mono text-[9px] text-[var(--paper)]/30">{time}</span>
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[var(--paper)]/90">{title}</p>
        <p className="mt-1 text-[12px] leading-5 text-[var(--paper)]/40">{detail}</p>
      </div>
      <Check size={15} className="ml-auto mt-1 shrink-0 text-[var(--paper)]/35" />
    </div>
  );
}

function Principles() {
  return (
    <section className="bg-[var(--coral)]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-12 lg:py-36">
        <div className="reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)]/55">04 / Ground rules</p>
          <h2 className="mt-6 max-w-[480px] font-display text-[clamp(3rem,5vw,5.7rem)] font-bold leading-[0.9] tracking-[-0.08em]">
            More capable.<br />Never less human.
          </h2>
        </div>
        <div className="reveal delay-1 grid gap-8 sm:grid-cols-2">
          <Principle icon={<ShieldCheck size={21} />} title="You stay in control" copy="Agents work inside the permissions and review points you choose. No mystery moves." />
          <Principle icon={<FileSearch size={21} />} title="Sources, not smoke" copy="Every research answer brings its trail with it, so you can trust the shortcut." />
          <Principle icon={<CircleDot size={21} />} title="Progress you can see" copy="Know what’s running, what’s waiting, and what needs your call at a glance." />
          <Principle icon={<BrainCircuit size={21} />} title="A point of view" copy="Teammates learn your standards over time. Useful gets personal." />
        </div>
      </div>
    </section>
  );
}

function Principle({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return (
    <div className="border-t border-[var(--ink)]/25 pt-5">
      <div className="text-[var(--ink)]">{icon}</div>
      <h3 className="mt-7 font-display text-xl font-bold tracking-[-0.045em]">{title}</h3>
      <p className="mt-2 text-[14px] leading-6 text-[var(--ink)]/65">{copy}</p>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[var(--paper)]">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-40">
        <div className="reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--coral)]">05 / Good questions</p>
          <h2 className="mt-6 max-w-[400px] font-display text-[clamp(3rem,5vw,5.3rem)] font-bold leading-[0.9] tracking-[-0.08em]">
            No fog.<br />Just useful.
          </h2>
          <p className="mt-7 max-w-[350px] text-[15px] leading-6 text-[var(--ink-soft)]/65">A new kind of teammate should be easy to understand before it ever asks for your trust.</p>
        </div>
        <div className="reveal delay-1 border-t border-[var(--line)]">
          {faqItems.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className="border-b border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  data-testid={`button-faq-${index}`}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 py-6 text-left"
                >
                  <span className="font-display text-xl font-bold tracking-[-0.045em]">{item.question}</span>
                  <ChevronDown size={19} className={`shrink-0 text-[var(--coral)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="max-w-[600px] pb-7 pr-8 text-[15px] leading-7 text-[var(--ink-soft)]/65">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-[var(--paper-deep)] px-5 py-5 sm:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[30px] bg-[var(--ink)] px-6 py-20 text-center text-[var(--paper)] sm:px-12 sm:py-28">
        <div className="orb absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[var(--acid)] opacity-90 blur-[1px]" />
        <div className="orb absolute -bottom-36 -right-24 h-80 w-80 rounded-full bg-[var(--coral)] opacity-85 blur-[1px]" style={{ animationDelay: '-2s' }} />
        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--acid)]">The next move is yours</p>
          <h2 className="mx-auto mt-6 max-w-[720px] font-display text-[clamp(3.2rem,7vw,7.5rem)] font-bold leading-[0.87] tracking-[-0.09em]">Make room for better work.</h2>
          <p className="mx-auto mt-7 max-w-[430px] text-[16px] leading-7 text-[var(--paper)]/60">Bring the work you keep postponing. We’ll help you hand it off.</p>
          <button type="button" onClick={onStart} data-testid="button-final-start" className="button-arrow group mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--acid)] px-7 py-4 text-sm font-bold text-[var(--ink)] transition-transform hover:-translate-y-1">
            Join the private beta <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer({ onStart }: { onStart: () => void }) {
  return (
    <footer className="bg-[var(--paper-deep)]">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-16 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 border-b border-[var(--line)] pb-14 md:flex-row">
          <div>
            <Logo />
            <p className="mt-5 max-w-[265px] text-[14px] leading-6 text-[var(--ink-soft)]/60">Digital teammates for people doing consequential work with small teams.</p>
          </div>
          <div className="flex flex-wrap gap-x-14 gap-y-8">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink)]/45">Explore</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-semibold">
                <a href="#mission" data-testid="link-footer-mission" className="hover:text-[var(--coral)]">Why Agentail</a>
                <a href="#agents" data-testid="link-footer-agents" className="hover:text-[var(--coral)]">Teammates</a>
                <a href="#field-notes" data-testid="link-footer-field-notes" className="hover:text-[var(--coral)]">Field notes</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink)]/45">Say hello</p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-semibold">
                <button type="button" onClick={onStart} data-testid="button-footer-contact" className="text-left hover:text-[var(--coral)]">Contact the team</button>
                <a href="mailto:hello@agentail.ai" data-testid="link-footer-email" className="hover:text-[var(--coral)]">hello@agentail.ai</a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-7 font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--ink)]/40 sm:flex-row">
          <span>© 2025 Agentail, Inc.</span>
          <span>Made for the work that matters</span>
        </div>
      </div>
    </footer>
  );
}

function InterestModal({ mode, onClose }: { mode: 'waitlist' | 'tour'; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-[var(--ink)]/70 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-panel relative w-full max-w-[530px] overflow-hidden rounded-[26px] bg-[var(--paper)] p-7 text-[var(--ink)] shadow-2xl sm:p-10">
        <button type="button" onClick={onClose} data-testid="button-modal-close" aria-label="Close dialog" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] hover:bg-[var(--paper-deep)]"><X size={17} /></button>
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--acid)]"><Send size={21} /></div>
        {!submitted ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-[var(--coral)]">{mode === 'tour' ? 'Get the tour' : 'Private beta'}</p>
            <h2 id="modal-title" className="mt-3 max-w-[390px] font-display text-4xl font-bold leading-[0.95] tracking-[-0.07em]">{mode === 'tour' ? 'See what a second brain feels like.' : 'Put your first teammate on the roster.'}</h2>
            <p className="mt-5 max-w-[410px] text-[15px] leading-6 text-[var(--ink-soft)]/70">{mode === 'tour' ? 'We’ll send a short product tour and a look at what’s coming next.' : 'Leave your email and we’ll send an invite when Agentail is ready for your kind of work.'}</p>
            <form onSubmit={submit} className="mt-8">
              <label htmlFor="interest-email" className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--ink)]/50">Work email</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input id="interest-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} data-testid="input-interest-email" placeholder="you@company.com" className="min-w-0 flex-1 rounded-full border border-[var(--line)] bg-[var(--paper-deep)] px-5 py-3.5 text-sm outline-none placeholder:text-[var(--ink)]/30 focus:border-[var(--coral)]" />
                <button type="submit" data-testid="button-interest-submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3.5 text-sm font-bold text-[var(--paper)] transition-transform hover:-translate-y-0.5">I’m in <ArrowRight size={15} /></button>
              </div>
            </form>
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--ink)]/35">No spam. No sales sequence. Just a note from the team.</p>
          </>
        ) : (
          <div data-testid="status-interest-success">
            <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-[var(--coral)]">You’re on the list</p>
            <h2 id="modal-title" className="mt-3 font-display text-4xl font-bold leading-[0.95] tracking-[-0.07em]">Good work starts with a little space.</h2>
            <p className="mt-5 text-[15px] leading-6 text-[var(--ink-soft)]/70">We’ll be in touch at <strong className="text-[var(--ink)]">{email}</strong>. Until then, keep the sharp work close.</p>
            <button type="button" onClick={onClose} data-testid="button-interest-done" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3.5 text-sm font-bold text-[var(--paper)]">Done <Check size={15} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [modalMode, setModalMode] = useState<'waitlist' | 'tour' | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-[100dvh]">
      <Header onStart={() => setModalMode('waitlist')} />
      <Hero onStart={() => setModalMode('waitlist')} onTour={() => setModalMode('tour')} />
      <Mission />
      <Agents />
      <Workbench />
      <Principles />
      <FAQ />
      <FinalCTA onStart={() => setModalMode('waitlist')} />
      <Footer onStart={() => setModalMode('waitlist')} />
      {modalMode && <InterestModal mode={modalMode} onClose={() => setModalMode(null)} />}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;