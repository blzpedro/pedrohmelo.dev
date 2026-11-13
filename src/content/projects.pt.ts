import type { ProjectSlug, ProjectText } from "./types";

export const projectsPt: Record<ProjectSlug, ProjectText> = {
  "electrolux-cost-grid": {
    title: "Controle de custos estilo Excel para uma multinacional",
    tagline:
      "Substituí uma ferramenta legada em PowerOn por uma grade web rápida, usada entre fábricas da Electrolux.",
    role: "Único dev front-end",
    metric: { value: "30–45s → 3–5s", label: "carregar e salvar em lote" },
    problem: [
      "Custos, indexação de matérias-primas, savings e dados mestres de fábricas e fornecedores de serviço ficavam numa aplicação legada em PowerOn. Telas e salvamentos em lote levavam de 30 a 45 segundos, e cada usuário precisava de uma licença de US$ 300.",
      "Quem usa pensa em planilha: muitas linhas, muitas edições de uma vez, um salvamento no fim. O substituto tinha que parecer Excel, só que mais rápido.",
    ],
    built: [
      "Uma aplicação web estilo Excel em React, TypeScript e Vite, com React Datasheet Grid para edição de planilha e Tailwind CSS na interface.",
      "Estado de servidor com TanStack Query, com as edições juntadas e salvas em lote.",
      "Notificações em tempo real com SignalR, além de exportação para Excel e PDF.",
      "Testes com Vitest, Testing Library e MSW, CI no GitHub Actions e deploy com Docker em Kubernetes.",
    ],
    decisions: [
      {
        title: "Salvar em lote",
        text: "As mudanças se acumulam no cliente e vão para o servidor juntas, do jeito que o pessoal já trabalhava na planilha.",
      },
      {
        title: "Mockar a API desde o primeiro dia",
        text: "Os handlers do MSW deixaram o front-end andar na frente do back-end e mantiveram os testes determinísticos.",
      },
      {
        title: "Entregar como produto",
        text: "Toda mudança passa por testes e CI e sai como container em Kubernetes.",
      },
    ],
    results: [
      { value: "30–45s → 3–5s", label: "carregamento e salvamento em lote" },
      { value: "US$ 300", label: "de licença por usuário eliminados" },
    ],
    demoNote:
      "Edite algumas células e salve tudo num lote só. Os dados são fictícios; a aplicação real é interna.",
  },
  "bmw-digital-shop": {
    title: "O carrinho e a fundação da BMW Motorrad na loja do BMW Group",
    tagline:
      "Fullstack numa plataforma de e-commerce de alto tráfego para BMW, MINI e BMW Motorrad, no ar em mais de 30 países. Feito presencialmente em Lisboa.",
    role: "Desenvolvedor fullstack",
    metric: { value: "30+", label: "países" },
    problem: [
      "Clientes da BMW e da MINI precisavam de um lugar só para comprar serviços digitais e peças e agendar manutenção e reparos, com um carrinho que funcionasse igual em todo mercado.",
      "Aí vinha uma terceira marca: a BMW Motorrad precisava da própria loja, na mesma plataforma, sem duplicar o código.",
      "Tudo isso roda em mais de 30 países, então cada preço, linha de imposto e data precisa seguir o mercado, com alto tráfego.",
    ],
    built: [
      "O carrinho: adicionar serviços, peças e equipamentos, mudar quantidades e os totais, impostos e moeda de cada mercado, do front em React e Next.js até o back em Node.js e AWS Lambda.",
      "A fundação da BMW Motorrad na plataforma, ao lado de BMW e MINI: a loja de equipamentos e vestuário, com tamanhos e preços promocionais, e a infraestrutura na AWS por trás dela.",
      "O seletor de veículo: o cliente informa o VIN, o veículo é identificado e a loja oferece só as peças que servem nele.",
      "A loja digital de serviços e peças, o fluxo de agendamento de manutenção e reparos e testes com Jest numa plataforma com cerca de 40 mil visitas por dia.",
      "Um importador de CSV na AWS para produtos, filtros e concessionárias: o arquivo chega ao S3 por trás do Akamai, uma Lambda valida cada campo, as credenciais vêm do Secrets Manager, os dados vão para o commercetools, e X-Ray e CloudWatch registram cada etapa.",
    ],
    decisions: [
      {
        title: "Uma plataforma, três marcas",
        text: "BMW, MINI e BMW Motorrad compartilham a loja e o carrinho; cada marca traz o próprio catálogo e visual, não o próprio código.",
      },
      {
        title: "Começar pelo veículo",
        text: "O VIN identifica exatamente o carro ou a moto, então o cliente não fica na dúvida se a peça serve.",
      },
      {
        title: "O mercado decide os números",
        text: "Moeda, imposto, regras de preço promocional e formato de data vêm do mercado, então o mesmo carrinho fica certo na Alemanha, no Reino Unido ou no Japão.",
      },
    ],
    results: [
      { value: "3", label: "marcas numa plataforma, Motorrad incluída" },
      { value: "30+", label: "países" },
      { value: "40 mil", label: "visitas por dia, segundo o Adobe Analytics" },
    ],
    demoNote:
      "Informe um VIN de exemplo para identificar o veículo e ver quais peças servem, navegue pelos equipamentos da BMW Motorrad com tamanhos, monte o carrinho e finalize. As requisições vão para Lambdas simuladas; produtos, VINs e preços são fictícios.",
    liveLabel: "Ver a loja da BMW Motorrad no ar",
    architectureText: {
      title: "Por trás da loja: o importador de catálogo",
      intro:
        "Produtos, filtros e concessionárias chegam à loja por uma importação de CSV na AWS. Escolha um arquivo e acompanhe cada etapa; a segunda linha é a loja lendo o que foi importado.",
    },
  },
  "movio-courier-app": {
    title: "Um app de entregador construído a partir de specs, com agentes de IA",
    tagline:
      "O app do entregador da Movio em React Native e o fluxo spec-driven em que agentes de IA implementam e pessoas revisam. Projeto paralelo.",
    role: "Desenvolvedor fullstack, projeto paralelo",
    metric: { value: "55 mil+", label: "entregas" },
    problem: [
      "A Movio liga restaurantes do iFood, 99Food, Takeat e Open Delivery a entregadores. O pedido precisa chegar a um entregador e ser aceito rápido, e o entregador está em movimento, com rede instável e o app muitas vezes em segundo plano.",
      "A maior parte do código é escrita por agentes de IA no Cursor e no Claude Code. Sem uma spec clara eles chutam, e a revisão vira retrabalho.",
    ],
    built: [
      "No app do entregador: a fila de ofertas de corrida em tempo real via WebSocket, prova de entrega com foto e código, localização em segundo plano, push, atualizações OTA e Sentry.",
      "Introduzi o Spec Kit no projeto: cada funcionalidade relevante começa com uma spec de negócio, que vira plano e tarefas antes da implementação pelos agentes.",
      "As regras de cada repositório ficam em AGENTS.md e CLAUDE.md, e toda entrega passa por lint, typecheck, build, testes E2E e revisão humana no PR.",
      "A spec do domínio de entregas da API reúne cenários, contratos e modelo de dados que guiam os agentes.",
    ],
    decisions: [
      {
        title: "A spec é a fonte da verdade",
        text: "Os cenários de aceite vêm primeiro, em Dado/Quando/Então; plano, tarefas e testes saem deles.",
      },
      {
        title: "Empurrar ofertas, não consultar",
        text: "As ofertas chegam ao entregador via WebSocket no momento em que existem.",
      },
      {
        title: "Entregar sem passar pela loja",
        text: "Com o PR aprovado, uma atualização OTA leva a mudança ao celular dos entregadores.",
      },
    ],
    results: [
      { value: "55 mil+", label: "entregas" },
      { value: "~4s", label: "para aceitar um pedido" },
      { value: "5", label: "checagens antes de cada merge" },
    ],
    demoNote:
      "À esquerda, uma funcionalidade vai da spec ao plano, tarefas, PR e atualização OTA. À direita, o app do entregador antes e depois dela. Faça uma entrega primeiro, depois entregue a funcionalidade e tente de novo. Os dados são fictícios.",
  },
};
