export type Project = {
  name: string;
  discipline: string;
  disciplinePt?: string;
  description: string;
  descriptionPt?: string;
  source: string;
  image: string;
  imageAlt?: string;
  imageAltPt?: string;
  imageCaption?: string;
  imageCaptionPt?: string;
  live: string;
  stack?: string[];
  flow?: string[];
  flowPt?: string[];
};

export const projects: Project[] = [
  {
    name: "LEIA",
    discipline: "AI / CODE DOCUMENTATION",
    disciplinePt: "IA / DOCUMENTAÇÃO DE CÓDIGO",
    description: "An AI documentation engine that reads a codebase and translates its structure into clear project documentation.",
    descriptionPt: "Uma ferramenta de documentação com IA que analisa uma base de código e transforma sua estrutura em documentação clara.",
    source: "https://github.com/gusata/LEIA",
    image: "",
    live: "",
    stack: ["JavaScript", "HTML", "CSS"],
    flow: ["SOURCE CODE", "AI ANALYSIS", "GENERATED DOCUMENTATION"],
    flowPt: ["CÓDIGO-FONTE", "ANÁLISE COM IA", "DOCUMENTAÇÃO GERADA"],
  },
  {
    name: "Formazzi",
    discipline: "FULL STACK / LEARNING",
    disciplinePt: "FULL STACK / TREINAMENTO",
    description: "A corporate training platform for courses, certifications, assessments and employee progress.",
    descriptionPt: "Uma plataforma de treinamento corporativo com cursos, certificações, avaliações e acompanhamento do progresso dos colaboradores.",
    source: "https://github.com/gusata/Front_Formazzi",
    image: "",
    live: "",
    stack: ["Django", "Next.js", "TypeScript", "Python"],
    flow: ["COURSES", "ASSESSMENTS", "CERTIFICATIONS", "EMPLOYEE PROGRESS"],
    flowPt: ["CURSOS", "AVALIAÇÕES", "CERTIFICAÇÕES", "PROGRESSO DOS COLABORADORES"],
  },
  {
    name: "Blitz",
    discipline: "PRODUCT / DOCUMENT OCR",
    disciplinePt: "PRODUTO / OCR DE DOCUMENTOS",
    description: "An AI-assisted OCR workflow that reads documents and sends extracted information into a system.",
    descriptionPt: "Um fluxo de OCR com apoio de IA que lê documentos e envia as informações extraídas para um sistema.",
    source: "",
    image: "/blitz3.jpeg",
    imageAlt: "Blitz dashboard with document reading and AI validation metrics",
    imageAltPt: "Painel do Blitz com leitura de documentos e métricas de validação por IA",
    imageCaption: "PRODUCT SCREEN / OCR DASHBOARD",
    imageCaptionPt: "TELA DO PRODUTO / PAINEL DE OCR",
    live: "",
    stack: ["TypeScript"],
    flow: ["DOCUMENT", "AI-ASSISTED OCR", "SYSTEM RECORD"],
    flowPt: ["DOCUMENTO", "OCR COM APOIO DE IA", "REGISTRO NO SISTEMA"],
  },
];
export type Photograph = { src: string; alt: string; altPt?: string; title: string; titlePt?: string; collection: string; width: number; height: number };
// Temporary Unsplash demonstration collection, authorized for layout previews.
export const photographyIsDemo = true;
export const photographs: Photograph[] = [
  {
    "src": "/photos/demo/frame-01.jpg",
    "alt": "Lake and mountains in soft natural light",
    "altPt": "Lago e montanhas sob luz natural suave",
    "title": "Still water",
    "titlePt": "Água parada",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-02.jpg",
    "alt": "A dramatic mountain peak beneath clouds",
    "altPt": "Um pico de montanha dramático sob as nuvens",
    "title": "Mountain air",
    "titlePt": "Ar da montanha",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-03.jpg",
    "alt": "Sunlight filtering through a green forest",
    "altPt": "Luz do sol atravessando uma floresta verde",
    "title": "Into the forest",
    "titlePt": "Dentro da floresta",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1199
  },
  {
    "src": "/photos/demo/frame-04.jpg",
    "alt": "Mountain silhouette under a star-filled sky",
    "altPt": "Silhueta de montanha sob um céu estrelado",
    "title": "After dusk",
    "titlePt": "Depois do anoitecer",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1201
  },
  {
    "src": "/photos/demo/frame-05.jpg",
    "alt": "Mountains and trees reflected in a calm lake",
    "altPt": "Montanhas e árvores refletidas em um lago tranquilo",
    "title": "Reflections",
    "titlePt": "Reflexos",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-06.jpg",
    "alt": "A broad mountain lake and distant hills",
    "altPt": "Um amplo lago de montanha e colinas ao longe",
    "title": "Open horizon",
    "titlePt": "Horizonte aberto",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-07.jpg",
    "alt": "Mountain landscape in warm sunlight",
    "altPt": "Paisagem montanhosa sob uma luz solar acolhedora",
    "title": "Far from here",
    "titlePt": "Longe daqui",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1196
  },
  {
    "src": "/photos/demo/frame-08.jpg",
    "alt": "Sunlit meadow and trees",
    "altPt": "Prado e árvores iluminados pelo sol",
    "title": "Afternoon light",
    "titlePt": "Luz da tarde",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  }
];
