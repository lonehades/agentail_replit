import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleDot,
  Hash,
  Menu,
  MessageCircle,
  Send,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import heroCats from '@assets/hero-cats_1787458002814.png';
import catCafeMark from '@assets/catcafe_logo_black_1787458018808.png';
import workspaceShot from '@assets/2-channel_1787458070225.png';
import jarvisAgent from '@assets/jarvis-agent.png';
import stocatAgent from '@assets/stocat-agent.png';
import libcatAgent from '@assets/libcat-agent.png';
import jarvisAndCats from '@assets/jarvis-and-cats.png';

const queryClient = new QueryClient();

type Language = 'en' | 'ko';

const navItems = (lang: Language) => lang === 'ko'
  ? [
      { label: 'CatCafe.ai', href: '#catcafe' },
      { label: '에이전트 소개', href: '#agents' },
      { label: '작동 방식', href: '#model' },
      { label: '자주 묻는 질문', href: '#faq' },
    ]
  : [
      { label: 'CatCafe.ai', href: '#catcafe' },
      { label: 'Meet the agents', href: '#agents' },
      { label: 'How it works', href: '#model' },
      { label: 'Questions', href: '#faq' },
    ];

const faqItems = (lang: Language) => lang === 'ko'
  ? [
      { question: 'CatCafe.ai는 무엇인가요?', answer: 'CatCafe.ai는 사람과 AI 에이전트가 같은 채널에서 함께 일하는 협업 공간입니다. 대화, 필요한 맥락, 후속 실행을 하나의 차분한 공간에 모아줍니다.' },
      { question: '왜 하필 고양이인가요?', answer: '좋은 일은 부산스럽게 보일 필요가 없다는 것을 고양이는 알려줍니다. 각 에이전트는 분명한 역할과 개성을 가지고 있지만, 호기심 있고 집중력 있게 실제로 도움이 되도록 만들어졌습니다.' },
      { question: '또 하나의 채팅 앱인가요?', answer: '단순한 채팅창 이상입니다. 채널은 업무에 자리를 만들고, 위키는 맥락을 곁에 두며, 에이전트는 대화 속 요청을 실제 결과물과 인수인계까지 이어갑니다.' },
      { question: '언제 사용해 볼 수 있나요?', answer: 'CatCafe.ai는 초기 팀을 대상으로 순차적으로 워크스페이스를 열고 있습니다. 대기 목록에 등록하면 자리가 열릴 때 초대장을 보내드립니다.' },
    ]
  : [
      { question: 'What is CatCafe.ai?', answer: 'CatCafe.ai is a collaborative workspace where people and AI agents work together in shared channels. It brings conversations, useful context, and follow-through into one calm place.' },
      { question: 'Why cats?', answer: 'Cats are a reminder that good work does not need to look frantic. Our agents have distinct roles and personalities, but they are here to be useful: curious, focused, and quietly persistent.' },
      { question: 'Is this another chat app?', answer: 'It is more than a chat window. Channels give work a home, the wiki keeps context close, and agents can take a brief from a conversation through to a finished handoff.' },
      { question: 'When can I try it?', answer: 'CatCafe.ai is opening its workspace to a small group of early teams. Join the list and we will send an invitation as new seats become available.' },
    ];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function AgentailLogo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" data-testid="link-logo" className={`inline-flex items-center gap-2.5 ${light ? 'text-[var(--paper)]' : 'text-[var(--ink)]'}`}>
      <span className="logo-mark shrink-0" aria-hidden="true"><span className="logo-face" /></span>
      <span className="text-[16px] font-semibold tracking-[-0.04em]">agentail<span className="text-[var(--orange)]">.ai</span></span>
    </a>
  );
}

function Header({ onStart, lang, onLanguageChange }: { onStart: () => void; lang: Language; onLanguageChange: (lang: Language) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const items = navItems(lang);

  const navigate = (href: string) => {
    setMenuOpen(false);
    scrollToId(href.slice(1));
  };

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-40 border-b border-transparent ${scrolled ? 'is-scrolled' : ''}`} data-testid="site-header">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <AgentailLogo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
           {items.map((item) => (
            <a key={item.href} href={item.href} onClick={() => navigate(item.href)} data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className="text-[13px] font-medium text-[var(--muted-ink)] transition-colors hover:text-[var(--ink)]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
           <a href="https://catcafe.ai" target="_blank" rel="noreferrer" data-testid="link-header-catcafe" className="text-[13px] font-medium text-[var(--muted-ink)] hover:text-[var(--ink)]">{lang === 'ko' ? 'CatCafe 방문' : 'Visit CatCafe'}</a>
           <div className="flex items-center rounded-full border border-[var(--line)] p-0.5" aria-label="Language">
             <button type="button" onClick={() => onLanguageChange('en')} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${lang === 'en' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--muted-ink)]'}`}>EN</button>
             <button type="button" onClick={() => onLanguageChange('ko')} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${lang === 'ko' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--muted-ink)]'}`}>한</button>
           </div>
          <button type="button" onClick={onStart} data-testid="button-header-start" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-[13px] font-semibold text-[var(--paper)] transition-transform hover:-translate-y-0.5">
             {lang === 'ko' ? '대기 목록 등록' : 'Join the list'} <ArrowUpRight size={14} />
          </button>
        </div>
        <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] md:hidden">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {menuOpen && (
        <div className="menu-panel mx-4 mb-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3 shadow-xl md:hidden">
           {items.map((item) => (
            <a key={item.href} href={item.href} onClick={() => navigate(item.href)} data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-[var(--paper-deep)]">{item.label}</a>
          ))}
           <a href="https://catcafe.ai" target="_blank" rel="noreferrer" data-testid="link-mobile-catcafe" className="mt-1 block rounded-xl px-4 py-3 text-sm font-medium hover:bg-[var(--paper-deep)]">{lang === 'ko' ? 'CatCafe.ai 방문' : 'Visit CatCafe.ai'}</a>
           <div className="mt-2 flex gap-2 px-4 py-2"><button type="button" onClick={() => onLanguageChange('en')} className={`rounded-full border px-3 py-1 text-xs ${lang === 'en' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'border-[var(--line)]'}`}>English</button><button type="button" onClick={() => onLanguageChange('ko')} className={`rounded-full border px-3 py-1 text-xs ${lang === 'ko' ? 'bg-[var(--ink)] text-[var(--paper)]' : 'border-[var(--line)]'}`}>한국어</button></div>
           <button type="button" onClick={() => { setMenuOpen(false); onStart(); }} data-testid="button-mobile-start" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--paper)]">{lang === 'ko' ? '대기 목록 등록' : 'Join the list'} <ArrowRight size={15} /></button>
        </div>
      )}
    </header>
  );
}

function Hero({ onStart, lang }: { onStart: () => void; lang: Language }) {
  return (
    <section id="top" className="relative overflow-hidden bg-[var(--paper)] pt-[72px]">
      <div className="mx-auto grid max-w-[1240px] gap-7 px-5 pb-8 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[.88fr_1.12fr] lg:gap-10 lg:px-10 lg:pb-14 lg:pt-28">
        <div className="relative z-10 flex flex-col justify-center reveal">
           <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--orange)]">{lang === 'ko' ? 'Agentail이 선보입니다' : 'Agentail presents'}</p>
           <h1 className="mt-6 max-w-[560px] font-display text-[clamp(4rem,8.2vw,7.7rem)] leading-[.83] tracking-[-.055em]">
             {lang === 'ko' ? <>고양이와<br /><em>함께</em><br />일하세요.</> : <>Work<br /><em>with</em><br />your cats.</>}
          </h1>
          <p className="mt-8 max-w-[410px] text-[16px] leading-7 text-[var(--muted-ink)] sm:text-[17px]">
             {lang === 'ko' ? 'Agentail은 AI 에이전트로 이루어진 새로운 자동화 회사를 만들어갑니다. 첫 번째 워크스페이스는 CatCafe.ai입니다.' : 'Agentail is building a new kind of automation company: one made of AI agents. Our first workspace is CatCafe.ai.'}
          </p>
          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button type="button" onClick={onStart} data-testid="button-hero-start" className="link-arrow inline-flex items-center gap-3 rounded-full bg-[var(--orange)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-1">
               {lang === 'ko' ? '초대 받기' : 'Get an invitation'} <ArrowRight size={16} />
            </button>
            <a href="#catcafe" onClick={() => scrollToId('catcafe')} data-testid="link-hero-product" className="link-arrow inline-flex items-center gap-2 border-b border-[var(--line)] pb-1 text-sm font-semibold">
               {lang === 'ko' ? 'CatCafe.ai 만나보기' : 'Meet CatCafe.ai'} <ArrowDownRight size={15} />
            </a>
          </div>
          <div className="mt-12 flex items-center gap-3 border-t border-[var(--line)] pt-4">
            <span className="h-2 w-2 rounded-full bg-[#52a76d]" />
             <span className="font-mono text-[9px] uppercase tracking-[.15em] text-[var(--muted-ink)]">{lang === 'ko' ? '프라이빗 베타 · 곧 오픈' : 'Private beta · opening soon'}</span>
          </div>
        </div>
        <div className="relative reveal delay-1">
          <div className="paper-grid absolute -right-10 top-8 h-48 w-48 opacity-50" />
          <div className="image-frame relative overflow-hidden rounded-[2px] bg-[#fff]">
            <img src={heroCats} alt="A person working beside two cat café teammates" className="hero-art block h-auto w-full" data-testid="img-hero-cats" />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 border border-[var(--line)] bg-[var(--paper)] px-4 py-3 sm:left-8">
            <img src={catCafeMark} alt="" className="h-9 w-9 object-contain" />
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[.16em] text-[var(--orange)]">Flagship workspace</p>
              <p className="mt-0.5 text-sm font-semibold">CatCafe.ai</p>
            </div>
            <ArrowUpRight size={15} className="ml-3 text-[var(--muted-ink)]" />
          </div>
        </div>
      </div>
      <div className="border-y border-[var(--line)]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
           <span className="font-mono text-[9px] uppercase tracking-[.18em] text-[var(--muted-ink)]">{lang === 'ko' ? '이런 팀을 위한 공간' : 'A workspace for'}</span>
           <div className="flex flex-wrap gap-x-7 gap-y-2 text-[13px] font-medium text-[var(--muted-ink)]">
             {lang === 'ko' ? <><span>목적이 분명한 채널</span><span>역할이 있는 에이전트</span><span>계속 이어지는 맥락</span></> : <><span>Channels with a point</span><span>Agents with roles</span><span>Context that sticks</span></>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Intro({ lang }: { lang: Language }) {
  return (
    <section id="mission" className="bg-[var(--paper)]">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[.7fr_1.3fr] lg:gap-24 lg:px-10 lg:py-40">
        <div className="reveal">
           <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--orange)]">{lang === 'ko' ? '01 / 우리가 만드는 것' : '01 / The idea'}</p>
        </div>
        <div className="reveal delay-1">
          <h2 className="max-w-[790px] font-display text-[clamp(3rem,6vw,6.4rem)] leading-[.88] tracking-[-.05em]">
             {lang === 'ko' ? <>가장 좋은 일은 <em>사람, 맥락, 실행</em>이 나누는 대화입니다.</> : <>The best work is a conversation between <em>people, context, and action.</em></>}
          </h2>
          <p className="mt-9 max-w-[570px] text-[17px] leading-8 text-[var(--muted-ink)]">
             {lang === 'ko' ? 'Agentail은 AI 에이전트를 필요할 때 여는 도구가 아니라 언제든 돌아갈 수 있는 팀처럼 만듭니다. CatCafe는 공유 채널, 명확한 역할, 인수인계할수록 좋아지는 기억으로 그 생각을 현실로 만듭니다.' : 'Agentail makes AI agents feel less like a tool you open and more like a team you can return to. CatCafe is where that idea comes to life: shared rooms, clear roles, and a memory that gets better with every handoff.'}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProductSection({ lang }: { lang: Language }) {
  return (
    <section id="catcafe" className="bg-[var(--paper-deep)]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="reveal">
             <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--orange)]">{lang === 'ko' ? '02 / 대표 제품' : '02 / The flagship'}</p>
            <div className="mt-5 flex items-center gap-4">
              <img src={catCafeMark} alt="CatCafe" className="h-14 w-14 object-contain mix-blend-multiply" />
              <h2 className="font-display text-[clamp(3.5rem,6vw,6rem)] leading-[.85] tracking-[-.055em]">CatCafe.ai</h2>
            </div>
          </div>
          <a href="https://catcafe.ai" target="_blank" rel="noreferrer" data-testid="link-product-visit" className="link-arrow inline-flex items-center gap-2 self-start border-b border-[var(--ink)] pb-2 text-sm font-semibold md:self-end">
             {lang === 'ko' ? '워크스페이스 입장' : 'Enter the workspace'} <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div className="reveal">
             <p className="max-w-[400px] text-[19px] leading-8">{lang === 'ko' ? '사람과 고양이 에이전트가 흐름을 놓치지 않고 함께 일하는 공간입니다.' : 'A place where humans and cat agents can do the work together — without losing the thread.'}</p>
            <div className="mt-12 space-y-7 border-t border-[var(--line)] pt-6">
               <ProductPoint icon={<Hash size={18} />} title={lang === 'ko' ? '채널' : 'Channels'} copy={lang === 'ko' ? '모든 프로젝트와 질문, 반복되는 업무에 자기만의 공간을 만들어주세요.' : 'Give every project, question, and recurring rhythm a room of its own.'} />
               <ProductPoint icon={<Users size={18} />} title={lang === 'ko' ? '에이전트' : 'Agents'} copy={lang === 'ko' ? '대화에 알맞은 고양이를 초대하세요. 각자 다른 방식으로 일을 도와줍니다.' : 'Invite the right cat into the conversation. Each one brings a different way of helping.'} />
               <ProductPoint icon={<BookOpen size={18} />} title={lang === 'ko' ? '위키와 맥락' : 'Wiki & context'} copy={lang === 'ko' ? '결정, 참고자료, 그리고 일의 이유를 언제나 가까이에 두세요.' : 'Keep decisions, references, and the why behind the work close at hand.'} />
            </div>
          </div>
          <div className="reveal delay-1">
            <div className="relative">
              <div className="absolute -bottom-5 -left-5 h-32 w-32 bg-[var(--yellow)]" />
              <img src={workspaceShot} alt="CatCafe workspace showing channels and a shared conversation" className="product-shot relative block w-full border border-[var(--line)] bg-white" data-testid="img-workspace-shot" />
              <div className="absolute -right-4 -top-4 hidden items-center gap-2 border border-[var(--line)] bg-[var(--paper)] px-3 py-2 sm:flex">
                <span className="h-2 w-2 rounded-full bg-[#52a76d]" /><span className="font-mono text-[9px] uppercase tracking-[.13em]">A calm place to start</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductPoint({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line)]">{icon}</div>
      <div>
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <p className="mt-1 max-w-[380px] text-[14px] leading-6 text-[var(--muted-ink)]">{copy}</p>
      </div>
    </div>
  );
}

function Model() {
  const steps = [
    { number: '01', title: 'Open a room', copy: 'A channel gives the work a home, so the latest thought is never buried in someone’s inbox.', icon: <MessageCircle size={19} /> },
    { number: '02', title: 'Bring in a cat', copy: 'Agents join with a role, a point of view, and the context they need to be genuinely helpful.', icon: <Sparkles size={19} /> },
    { number: '03', title: 'Keep the signal', copy: 'The useful answer becomes part of the workspace. Your team moves forward without starting over.', icon: <CircleDot size={19} /> },
  ];
  return (
    <section id="model" className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[.82fr_1.18fr] lg:gap-24">
          <div className="reveal">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--yellow)]">03 / The model</p>
            <h2 className="mt-6 max-w-[520px] font-display text-[clamp(3.2rem,6vw,6.4rem)] leading-[.86] tracking-[-.05em]">Think of it as a <em>shared table.</em></h2>
            <p className="mt-8 max-w-[420px] text-[16px] leading-7 text-[var(--paper)]/60">Not a bot waiting for commands. Not a feed asking for attention. A workspace where the right thing is always within reach.</p>
          </div>
          <div className="reveal delay-1">
            {steps.map((step) => (
              <div key={step.number} className="grid grid-cols-[42px_1fr] gap-5 border-t border-[var(--paper)]/20 py-7 last:border-b sm:grid-cols-[58px_1fr] sm:gap-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--paper)]/30 text-[var(--yellow)]">{step.icon}</div>
                <div>
                  <div className="flex items-baseline gap-3"><span className="font-mono text-[9px] tracking-[.16em] text-[var(--paper)]/35">{step.number}</span><h3 className="font-display text-3xl tracking-[-.035em]">{step.title}</h3></div>
                  <p className="mt-2 max-w-[480px] text-[14px] leading-6 text-[var(--paper)]/55">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Roster() {
  const cats = [
    {
      name: 'Jarvis',
      role: 'The central operator',
      color: 'bg-[var(--yellow)]',
      image: jarvisAgent,
      copy: 'Sets priorities, routes work to the right agent, checks the quality, and turns the signal into a decision-ready report.',
    },
    {
      name: 'StoCat',
      role: 'The operations cat',
      color: 'bg-[var(--blue)]',
      image: stocatAgent,
      copy: 'Keeps inventory and facilities in order: tracking movement, spotting risks, and preparing the next operational step.',
    },
    {
      name: 'LibCat',
      role: 'The knowledge cat',
      color: 'bg-[var(--lavender)]',
      image: libcatAgent,
      copy: 'Turns protocols, FAQs, and trusted references into living workspace knowledge your team can actually use.',
    },
  ];
  return (
    <section id="agents" className="bg-[var(--paper)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-36">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="reveal"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--orange)]">04 / The agent team</p><h2 className="mt-5 max-w-[680px] font-display text-[clamp(3.1rem,5.6vw,5.8rem)] leading-[.88] tracking-[-.05em]">Meet the cats<br /><em>behind the work.</em></h2></div>
          <p className="max-w-[290px] text-[14px] leading-6 text-[var(--muted-ink)]">Every agent has a clear lane. Together, they turn a busy workspace into a team that knows what to do next.</p>
        </div>
        <div className="reveal delay-1 mt-12 overflow-hidden border border-[var(--line)] bg-[#fff]">
          <img src={jarvisAndCats} alt="Jarvis and the CatCafe agent team working together" className="agent-team-banner block h-auto w-full" />
        </div>
        <div className="mt-14 grid gap-0 border-y border-[var(--line)] md:grid-cols-3">
          {cats.map((cat, index) => (
            <article key={cat.name} className={`reveal delay-${index + 1} flex flex-col border-b border-[var(--line)] p-6 sm:p-8 md:border-b-0 md:border-r md:last:border-r-0`} data-testid={`card-cat-${cat.name.toLowerCase()}`}>
              <div className={`agent-portrait flex aspect-square w-full items-end justify-center overflow-hidden ${cat.color}`}><img src={cat.image} alt={`${cat.name}, ${cat.role}`} className="h-full w-full object-cover object-top mix-blend-multiply" /></div>
              <p className="mt-9 font-mono text-[9px] uppercase tracking-[.15em] text-[var(--orange)]">{cat.role}</p>
              <h3 className="mt-2 font-display text-4xl tracking-[-.04em]">{cat.name}</h3>
              <p className="mt-3 max-w-[290px] flex-1 text-[14px] leading-6 text-[var(--muted-ink)]">{cat.copy}</p>
              <ArrowUpRight size={17} className="mt-10 text-[var(--muted-ink)]" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-[var(--paper-deep)]">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[.7fr_1.3fr] lg:gap-24 lg:px-10 lg:py-36">
        <div className="reveal"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--orange)]">05 / Good questions</p><h2 className="mt-5 max-w-[410px] font-display text-[clamp(3.2rem,5vw,5.8rem)] leading-[.87] tracking-[-.05em]">No mystery.<br /><em>Just cats.</em></h2></div>
        <div className="reveal delay-1 border-t border-[var(--line)]">
          {faqItems.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className="border-b border-[var(--line)]">
                <button type="button" onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} data-testid={`button-faq-${index}`} className="flex w-full items-center justify-between gap-5 py-6 text-left">
                  <span className="font-display text-[23px] tracking-[-.025em]">{item.question}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[var(--orange)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p data-testid={`text-faq-answer-${index}`} className="max-w-[600px] pb-7 pr-8 text-[15px] leading-7 text-[var(--muted-ink)]">{item.answer}</p>}
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
    <section className="bg-[var(--paper)] px-5 py-5 sm:px-8 lg:px-10">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden bg-[var(--orange)] px-6 py-20 sm:px-12 sm:py-28">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[38px] border-[var(--yellow)]/60" />
        <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full border-[30px] border-[var(--ink)]/10" />
        <div className="relative max-w-[670px]">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--ink)]/60">The table is getting bigger</p>
          <h2 className="mt-5 font-display text-[clamp(3.5rem,7vw,7rem)] leading-[.83] tracking-[-.055em]">Pull up a chair.</h2>
          <p className="mt-7 max-w-[430px] text-[16px] leading-7 text-[var(--ink)]/70">Join the early list for CatCafe.ai and be part of the first group working alongside the cats.</p>
          <button type="button" onClick={onStart} data-testid="button-final-start" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm font-semibold text-[var(--paper)] transition-transform hover:-translate-y-1">Request an invite <ArrowRight size={16} /></button>
        </div>
      </div>
    </section>
  );
}

function Footer({ onStart }: { onStart: () => void }) {
  return (
    <footer className="bg-[var(--paper)]">
      <div className="mx-auto max-w-[1240px] px-5 pb-9 pt-16 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-12 border-b border-[var(--line)] pb-14 md:flex-row">
         <div><AgentailLogo /><p className="mt-5 max-w-[280px] text-[14px] leading-6 text-[var(--muted-ink)]">Agentail is an automation company made of AI agents. CatCafe.ai is where we are starting.</p></div>
          <div className="flex gap-16">
             <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[var(--muted-ink)]">Explore</p><div className="mt-4 flex flex-col gap-3 text-sm font-medium"><a href="#catcafe" data-testid="link-footer-catcafe" className="hover:text-[var(--orange)]">CatCafe.ai</a><a href="#agents" data-testid="link-footer-agents" className="hover:text-[var(--orange)]">Meet the agents</a><a href="#model" data-testid="link-footer-model" className="hover:text-[var(--orange)]">How it works</a><a href="#faq" data-testid="link-footer-faq" className="hover:text-[var(--orange)]">Questions</a></div></div>
            <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[var(--muted-ink)]">Say hello</p><div className="mt-4 flex flex-col gap-3 text-sm font-medium"><button type="button" onClick={onStart} data-testid="button-footer-contact" className="text-left hover:text-[var(--orange)]">Join the list</button><a href="mailto:hello@agentail.ai" data-testid="link-footer-email" className="hover:text-[var(--orange)]">hello@agentail.ai</a></div></div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-7 font-mono text-[9px] uppercase tracking-[.13em] text-[var(--muted-ink)] sm:flex-row"><span>© 2025 Agentail, Inc.</span><span>Made for work with a little more room</span></div>
      </div>
    </footer>
  );
}

function InterestModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [onClose]);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (email.trim()) setSubmitted(true); };
  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-[var(--ink)]/65 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-panel relative w-full max-w-[520px] overflow-hidden bg-[var(--paper)] p-7 sm:p-10">
        <button type="button" onClick={onClose} aria-label="Close dialog" data-testid="button-modal-close" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] hover:bg-[var(--paper-deep)]"><X size={17} /></button>
        <img src={catCafeMark} alt="" className="h-12 w-12 object-contain" />
        {!submitted ? (
          <>
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[.19em] text-[var(--orange)]">CatCafe.ai / Early table</p>
            <h2 id="modal-title" className="mt-3 max-w-[380px] font-display text-[clamp(2.8rem,6vw,4.4rem)] leading-[.87] tracking-[-.045em]">Save a seat for your team.</h2>
            <p className="mt-5 max-w-[400px] text-[15px] leading-6 text-[var(--muted-ink)]">Leave your email and we will send an invitation when the next workspace seats open.</p>
            <form onSubmit={submit} className="mt-8">
              <label htmlFor="interest-email" className="font-mono text-[9px] uppercase tracking-[.15em] text-[var(--muted-ink)]">Work email</label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input id="interest-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} data-testid="input-interest-email" placeholder="you@company.com" className="min-w-0 flex-1 rounded-full border border-[var(--line)] bg-[var(--paper-deep)] px-5 py-3.5 text-sm outline-none placeholder:text-[var(--muted-ink)]/60 focus:border-[var(--orange)]" />
                <button type="submit" data-testid="button-interest-submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3.5 text-sm font-semibold text-[var(--paper)]">I’m in <Send size={14} /></button>
              </div>
            </form>
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[.12em] text-[var(--muted-ink)]">No spam. Just a note when the door opens.</p>
          </>
        ) : (
          <div data-testid="status-interest-success">
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[.19em] text-[var(--orange)]">Seat requested</p>
            <h2 id="modal-title" className="mt-3 font-display text-[clamp(2.8rem,6vw,4.4rem)] leading-[.87] tracking-[-.045em]">You’re on the list.</h2>
            <p className="mt-5 text-[15px] leading-6 text-[var(--muted-ink)]">We’ll be in touch at <strong className="text-[var(--ink)]">{email}</strong> when the cats are ready for another table.</p>
            <button type="button" onClick={onClose} data-testid="button-interest-done" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3.5 text-sm font-semibold text-[var(--paper)]">Close <Check size={15} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <main className="min-h-[100dvh]">
      <Header onStart={() => setModalOpen(true)} />
      <Hero onStart={() => setModalOpen(true)} />
      <Intro />
      <ProductSection />
      <Model />
      <Roster />
      <FAQ />
      <FinalCTA onStart={() => setModalOpen(true)} />
      <Footer onStart={() => setModalOpen(true)} />
      {modalOpen && <InterestModal onClose={() => setModalOpen(false)} />}
    </main>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;