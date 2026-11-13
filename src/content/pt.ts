import type { ProfileText } from "./types";

export const pt: ProfileText = {
  about: [
    "Sou desenvolvedor de software e gosto de front-end, futebol e tecnologia. Nos últimos {years} anos construí produtos para logística, automotivo, bancos, varejo e saúde, incluindo marcas globais como BMW, Electrolux e Renault, e um ano em Lisboa como dev fullstack numa plataforma de e-commerce presente em mais de 30 países.",
    "Me importo com qualidade que as pessoas sentem: telas rápidas, fluxos claros e código em que o próximo dev pode confiar. Hoje isso inclui trabalhar com agentes de IA usando Spec-Driven Development, com toda mudança ainda revisada por uma pessoa.",
    "Programando, assistindo a um jogo ou testando uma ferramenta nova, estou sempre atrás da próxima coisa para aprender.",
  ],
  focus: "React, Angular, Node.js, React Native",
  experience: {
    movio: {
      role: "Desenvolvedor Fullstack",
      location: "Brasil",
      summary:
        "Plataforma de logística de última milha integrada a iFood, 99Food, Takeat e Open Delivery.",
      highlights: [
        "App do entregador em React Native na Google Play: ofertas de corrida em tempo real via WebSocket, prova de entrega, localização em segundo plano e OTA.",
        "Trouxe o Spec Kit: cada funcionalidade começa como spec de negócio e vira plano e tarefas antes dos agentes de IA implementarem.",
        "Toda mudança passa por lint, typecheck, testes E2E e revisão humana no PR.",
      ],
      metrics: [
        { value: "55 mil+", label: "entregas" },
        { value: "~4s", label: "para aceitar um pedido" },
      ],
    },
    electrolux: {
      role: "Desenvolvedor Front-end",
      location: "São Paulo, Brasil",
      summary:
        "Ferramentas internas de controle de custos e gestão de fornecedores entre fábricas.",
      highlights: [
        "Único dev front-end do app estilo Excel que substituiu o PowerOn legado, com React, TanStack Query e React Datasheet Grid.",
        "Atualizações em tempo real com SignalR, exportação Excel/PDF, testes com Vitest e MSW, deploy em Kubernetes.",
        "Onboarding de fornecedores em micro frontends Angular 20 com Module Federation e Signals.",
      ],
      metrics: [
        { value: "30–45s → 3–5s", label: "carregar e salvar em lote" },
        { value: "US$ 300", label: "licença por usuário eliminada" },
      ],
      scope: "Global, o Electrolux Group é uma multinacional sueca",
    },
    "linked-gourmet": {
      role: "Desenvolvedor Front-end",
      location: "São Paulo, Brasil",
      summary: "Cardápios digitais, redes de lojas e PDV para restaurantes.",
      highlights: [
        "Criei pagamento via PIX, QR Codes nas mesas, edição de cardápios em lote e agendamento de pedidos.",
        "Migrei a aplicação do Angular 7 ao Angular 20, adotando Signals, standalone components, o novo control flow e inject().",
      ],
      metrics: [{ value: "7 → 20", label: "versões de Angular migradas" }],
    },
    mobilize: {
      role: "Desenvolvedor Front-end",
      location: "Brasil",
      summary:
        "Aplicação do Banco RCI, braço financeiro do Grupo Renault: simulações financeiras, concessionárias e controle de alçadas.",
      highlights: [
        "Micro frontends em Angular com Module Federation, NgRx e design system interno.",
        "Participei da migração do Angular 9 para o Angular 15.",
      ],
      metrics: [{ value: "9 → 15", label: "versões de Angular migradas" }],
      scope: "Global, o braço financeiro do Grupo Renault",
    },
    bmw: {
      role: "Desenvolvedor Fullstack",
      location: "Lisboa, Portugal",
      summary:
        "E-commerce de alto tráfego para BMW, MINI e BMW Motorrad, no ar em mais de 30 países.",
      highlights: [
        "Construí o carrinho na stack inteira: React e Next.js no front-end, Node.js e AWS Lambda por trás.",
        "Fiz a fundação da BMW Motorrad na plataforma, incluindo a loja de equipamentos e vestuário e a infraestrutura na AWS.",
        "Construí o seletor de veículo: informa o VIN e a loja mostra só as peças que servem.",
      ],
      metrics: [
        { value: "30+", label: "países" },
        { value: "40 mil", label: "visitas por dia" },
      ],
      scope: "Global, feito presencialmente em Lisboa para BMW, MINI e BMW Motorrad",
    },
    performa: {
      role: "Desenvolvedor Front-end",
      location: "Campinas, Brasil",
      summary: "App de busca de vagas e portais de clientes.",
      highlights: [
        "Coordenei o time de um app de busca de vagas usado por mais de 3.000 pessoas.",
        "Projetei do zero a arquitetura de um portal do cliente, liderando 2 devs front-end.",
        "Integrei APIs GraphQL com Apollo Client e operações tipadas geradas pelo GraphQL Code Generator.",
      ],
      metrics: [{ value: "3.000+", label: "candidatos" }],
    },
    modalgr: {
      role: "Desenvolvedor Front-end",
      location: "Santos, Brasil",
      summary:
        "Sistemas para a área portuária, clínicas médicas e portais de clientes.",
      highlights: [
        "Desenvolvi um totem de autoatendimento e um sistema de recepção para uma clínica médica.",
        "Construí portais de clientes do zero e ensinei novos devs e estagiários.",
        "React, React Native e Angular com GraphQL, TDD e Jest.",
      ],
      metrics: [],
    },
    alleasy: {
      role: "Desenvolvedor Fullstack",
      location: "São Paulo, Brasil",
      summary: "Sistemas acadêmico e financeiro de uma universidade.",
      highlights: [
        "Corrigi bugs e entreguei funcionalidades num sistema acadêmico usado por mais de 30 mil alunos.",
        "PHP e Laravel no back-end, Vue no front-end.",
      ],
      metrics: [{ value: "30 mil+", label: "alunos" }],
    },
  },
  skillGroups: {
    frontend: "Front-end",
    mobile: "Mobile",
    backend: "Back-end e nuvem",
    testing: "Testes",
    delivery: "CI/CD e infraestrutura",
    ai: "Desenvolvimento com IA",
    ways: "Formas de trabalho",
  },
  education: {
    degree: "Tecnólogo em Sistemas para Internet",
    school: "Fatec Baixada Santista Rubens Lara",
    period: "2017–2020",
    location: "Santos, Brasil",
  },
  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "C1, avançado" },
  ],
};
