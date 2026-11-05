"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type Language = "pt" | "en" | "jp";

export const languageOptions: { id: Language; label: string }[] = [
  { id: "pt", label: "PT" },
  { id: "en", label: "EN" },
  { id: "jp", label: "日本語" },
];

type Copy = {
  nav: { home: string; about: string; projects: string; contact: string; talk: string; label: string; menu: string; closeMenu: string };
  hero: {
    title: string;
    kicker: string;
    subtitle: string;
    work: string;
    about: string;
    scroll: string;
    sakura: string;
    sakuraLabel: string;
    languageLabel: string;
    introLabel: string;
    introBottom: string;
    skip: string;
  };
  about: {
    section: string;
    location: string;
    eyebrow: string;
    headingOne: string;
    headingTwo: string;
    headingThree: string;
    paragraphOne: string;
    paragraphTwo: string;
    role: string;
    imageAlt: string;
    imageCaption: string;
    tools: string;
  };
  projects: {
    section: string;
    eyebrow: string;
    titleOne: string;
    titleTwo: string;
    open: string;
    github: string;
    live: string;
    close: string;
    items: { category: string; tagline: string; description: string }[];
  };
  contact: {
    section: string;
    availability: string;
    eyebrow: string;
    headingOne: string;
    headingTwo: string;
    headingThree: string;
    paragraph: string;
    location: string;
    signoff: string;
  };
};

const copy: Record<Language, Copy> = {
  pt: {
    nav: { home: "Início", about: "Sobre", projects: "Projetos", contact: "Contato", talk: "Vamos conversar", label: "Navegação principal", menu: "Abrir menu", closeMenu: "Fechar menu" },
    hero: {
      title: "Crio sistemas, experiências e modelos que ampliam as possibilidades da tecnologia.",
      kicker: "Desenvolvedor independente / São Paulo, BR",
      subtitle: "Software pensado com cuidado, entre engenharia e imaginação.",
      work: "Explorar projetos",
      about: "Um pouco sobre mim",
      scroll: "Role para explorar",
      sakura: "Uma pequena sakura",
      sakuraLabel: "Soltar pétalas de cerejeira",
      languageLabel: "Escolher idioma",
      introLabel: "Um portfólio pessoal",
      introBottom: "Entre nos projetos",
      skip: "Pular abertura",
    },
    about: {
      section: "02 / Sobre",
      location: "GUSTAVO GALEAZZI · SÃO PAULO",
      eyebrow: "SOFTWARE · IA · CRIAÇÃO",
      headingOne: "Full Stack",
      headingTwo: "Desenvolvedor",
      headingThree: "& AI Builder.",
      paragraphOne: "Programo desde criança. Depois de me formar como técnico em Sistemas pela ETEC em 2023, continuei na FATEC e hoje trabalho como desenvolvedor júnior no Grupo DirectWeb.",
      paragraphTwo: "Atuo em toda a stack, com foco especial em IA, Python e visão computacional. Gosto de transformar ideias complexas em produtos úteis e bem pensados.",
      role: "Desenvolvedor júnior · Grupo DirectWeb",
      imageAlt: "Ilustração de uma rua japonesa com elementos de inteligência artificial",
      imageCaption: "Tecnologia com um toque humano.",
      tools: "Ferramentas de trabalho",
    },
    projects: {
      section: "03 / Projetos selecionados",
      eyebrow: "Ideias que saíram do papel",
      titleOne: "Projetos",
      titleTwo: "selecionados.",
      open: "ABRIR",
      github: "GitHub",
      live: "Versão online",
      close: "Fechar detalhes do projeto",
      items: [
        { category: "Ferramenta de IA", tagline: "IA no seu desktop.", description: "Utilitário para Windows integrado ao Claude Code, com uso de tokens, limites da sessão e progresso do plano em notificações nativas." },
        { category: "IA / Documentação", tagline: "Documentação na velocidade do pensamento.", description: "Ferramenta de documentação de código com IA. Analisa o projeto inteiro e cria documentação abrangente muito mais rápido que o processo manual." },
        { category: "Produto / Interface", tagline: "Seu navegador, suas regras.", description: "Página inicial minimalista para navegador, com bloco de notas instantâneo e atalhos de texto. Os dados ficam no dispositivo, sem conta ou servidor." },
        { category: "Full stack", tagline: "Capacite equipes. Crie futuros.", description: "Plataforma de treinamento corporativo com cursos, certificações, avaliações e acompanhamento de progresso em uma solução full stack." },
        { category: "Produto", tagline: "Uma comunidade para quem ama carros.", description: "Rede social automotiva para entusiastas compartilharem referências, conversas e projetos." },
        { category: "Produto / IA", tagline: "Informação certa, no tempo certo.", description: "Projeto com leitura inteligente de documentos por OCR e inteligência artificial para organizar informações com agilidade." },
      ],
    },
    contact: {
      section: "04 / Contato",
      availability: "ABERTO A NOVOS PROJETOS",
      eyebrow: "VAMOS CRIAR ALGO JUNTOS",
      headingOne: "Vamos criar",
      headingTwo: "algo que",
      headingThree: "importe.",
      paragraph: "Aberto a consultorias, parcerias e projetos criativos que unam inteligência artificial, engenharia e design com intenção.",
      location: "Gustavo Galeazzi · São Paulo, Brasil",
      signoff: "よろしくお願いします",
    },
  },
  en: {
    nav: { home: "Home", about: "About", projects: "Selected work", contact: "Contact", talk: "Let's talk", label: "Main navigation", menu: "Open menu", closeMenu: "Close menu" },
    hero: {
      title: "Building systems, experiences and models that elevate what technology can do.",
      kicker: "Independent developer / São Paulo, BR",
      subtitle: "Thoughtful software, built at the intersection of engineering and imagination.",
      work: "Explore my work",
      about: "A little about me",
      scroll: "Scroll to explore",
      sakura: "A little sakura",
      sakuraLabel: "Release cherry blossom petals",
      languageLabel: "Choose language",
      introLabel: "A personal portfolio",
      introBottom: "Enter the work",
      skip: "Skip intro",
    },
    about: {
      section: "02 / About",
      location: "GUSTAVO GALEAZZI · SÃO PAULO",
      eyebrow: "SOFTWARE · AI · CREATION",
      headingOne: "Full Stack",
      headingTwo: "Developer",
      headingThree: "& AI Builder.",
      paragraphOne: "Programming since childhood. After graduating as a Systems technician at ETEC in 2023, I continued at FATEC and now work as a Junior Developer at Grupo DirectWeb.",
      paragraphTwo: "I build across the stack, with a special focus on AI, Python and computer vision. I like turning complex ideas into useful, thoughtful products.",
      role: "Junior Developer · Grupo DirectWeb",
      imageAlt: "Illustration of a Japanese street with artificial intelligence elements",
      imageCaption: "Technology, with a human touch.",
      tools: "Tools of the trade",
    },
    projects: {
      section: "03 / Selected work",
      eyebrow: "A few ideas made real",
      titleOne: "Selected",
      titleTwo: "work.",
      open: "OPEN",
      github: "GitHub",
      live: "Live site",
      close: "Close project details",
      items: [
        { category: "AI Tooling", tagline: "AI usage, on your desktop.", description: "Windows utility that hooks into Claude Code and surfaces real-time token usage, session limits, and plan progress through native OS notifications." },
        { category: "AI / Docs", tagline: "Documentation at the speed of thought.", description: "AI-powered code documentation engine. Analyzes your codebase and generates comprehensive docs far faster than writing by hand." },
        { category: "Product / UI", tagline: "Your browser, your rules.", description: "Minimalist browser start page with an instant note editor and smart text shortcuts. Everything is stored locally, with no account or server." },
        { category: "Full Stack", tagline: "Train teams. Build futures.", description: "Corporate training platform for courses, certifications, assessments and employee progress tracking across the full stack." },
        { category: "Product", tagline: "A community for people who love cars.", description: "An automotive social network where car lovers can share references, conversations and projects." },
        { category: "Product / AI", tagline: "The right information, at the right time.", description: "A project using OCR and artificial intelligence to read and organize information from documents." },
      ],
    },
    contact: {
      section: "04 / Contact",
      availability: "OPEN TO WHAT'S NEXT",
      eyebrow: "LET'S MAKE SOMETHING TOGETHER",
      headingOne: "Let's make",
      headingTwo: "something",
      headingThree: "matter.",
      paragraph: "Open to consulting, partnerships and creative projects that blend AI, engineering and thoughtful design.",
      location: "Gustavo Galeazzi · São Paulo, Brazil",
      signoff: "よろしくお願いします",
    },
  },
  jp: {
    nav: { home: "ホーム", about: "プロフィール", projects: "制作実績", contact: "連絡先", talk: "話しましょう", label: "メインナビゲーション", menu: "メニューを開く", closeMenu: "メニューを閉じる" },
    hero: {
      title: "テクノロジーの可能性を広げる、システムと体験とモデルをつくる。",
      kicker: "独立系デベロッパー / サンパウロ",
      subtitle: "エンジニアリングと想像力の交差点から、丁寧なソフトウェアを。",
      work: "制作実績を見る",
      about: "プロフィール",
      scroll: "スクロールして見る",
      sakura: "桜をひとひら",
      sakuraLabel: "桜の花びらを舞わせる",
      languageLabel: "言語を選択",
      introLabel: "パーソナルポートフォリオ",
      introBottom: "作品を見る",
      skip: "イントロをスキップ",
    },
    about: {
      section: "02 / プロフィール",
      location: "グスタボ・ガレアッジ · サンパウロ",
      eyebrow: "ソフトウェア · AI · 創造",
      headingOne: "フルスタック",
      headingTwo: "デベロッパー",
      headingThree: "& AI ビルダー。",
      paragraphOne: "子どもの頃からプログラミングに親しみ、2023年にETECでシステム開発を学びました。現在はFATECで学びながら、Grupo DirectWebでジュニア開発者として働いています。",
      paragraphTwo: "幅広い技術領域に取り組み、特にAI、Python、コンピュータビジョンに注力しています。複雑なアイデアを役立つプロダクトにすることが好きです。",
      role: "ジュニア開発者 · Grupo DirectWeb",
      imageAlt: "人工知能をテーマにした日本の街並みのイラスト",
      imageCaption: "人に寄り添うテクノロジー。",
      tools: "使用技術",
    },
    projects: {
      section: "03 / 制作実績",
      eyebrow: "アイデアを、かたちに",
      titleOne: "Selected",
      titleTwo: "works.",
      open: "開く",
      github: "GitHub",
      live: "公開サイト",
      close: "プロジェクトの詳細を閉じる",
      items: [
        { category: "AI ツール", tagline: "デスクトップでAIの使用状況を把握。", description: "Claude Codeと連携するWindowsユーティリティ。トークン使用量、セッション制限、プランの進捗をネイティブ通知で表示します。" },
        { category: "AI / ドキュメント", tagline: "思考の速さでドキュメントを。", description: "コードベースを解析し、手作業よりも速く包括的なドキュメントを生成するAIエンジンです。" },
        { category: "プロダクト / UI", tagline: "ブラウザを、自分らしく。", description: "すぐに書けるメモと便利なテキストショートカットを備えた、ミニマルなブラウザのスタートページ。データは端末内に保存されます。" },
        { category: "フルスタック", tagline: "チームを育て、未来をつくる。", description: "コース、認定、評価、社員の進捗管理をまとめた企業向けトレーニングプラットフォームです。" },
        { category: "プロダクト", tagline: "クルマを愛する人のコミュニティ。", description: "自動車好きがアイデアや会話、プロジェクトを共有できるソーシャルネットワークです。" },
        { category: "プロダクト / AI", tagline: "必要な情報を、必要なときに。", description: "OCRと人工知能で書類を読み取り、情報の整理を効率化するプロジェクトです。" },
      ],
    },
    contact: {
      section: "04 / お問い合わせ",
      availability: "新しいプロジェクトを受付中",
      eyebrow: "一緒に、何かをつくりましょう",
      headingOne: "一緒に",
      headingTwo: "意味のある",
      headingThree: "ものを。",
      paragraph: "AI、エンジニアリング、丁寧なデザインを組み合わせたプロジェクトや、協業のご相談をお待ちしています。",
      location: "グスタボ・ガレアッジ · ブラジル、サンパウロ",
      signoff: "よろしくお願いします",
    },
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: Copy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = "portfolio-language";
const LANGUAGE_CHANGE_EVENT = "portfolio-language-change";
let inMemoryLanguage: Language = "pt";

function getLanguageSnapshot(): Language {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "pt" || saved === "en" || saved === "jp") return saved;
  } catch {}
  return inMemoryLanguage;
}

function getServerLanguageSnapshot(): Language { return "pt"; }

function subscribeToLanguage(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, listener);
  };
}

function updateLanguage(language: Language) {
  inMemoryLanguage = language;
  try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch {}
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribeToLanguage, getLanguageSnapshot, getServerLanguageSnapshot);

  useEffect(() => {
    document.documentElement.lang = language === "jp" ? "ja" : language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage: updateLanguage, copy: copy[language] }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
