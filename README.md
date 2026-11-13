# Portfólio — Pedro Melo

Portfólio em Next.js 16 com i18n (PT-BR e EN), tema escuro/claro, estudos de caso com demos interativas e a trajetória contada como um `git log --graph` dentro de um terminal.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000 → redireciona para /pt ou /en
```

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | Gera os tipos de rota do Next e roda o `tsc` |
| `npm test` | Vitest: paridade PT/EN das mensagens e do conteúdo, datas |
| `npm run test:e2e` | Playwright (desktop e mobile) contra o build de produção |
| `npm run build` | Build; `/en` e `/pt` saem estáticas |

Na primeira vez, instale o navegador do Playwright: `npx playwright install chromium`.

## Onde mexer

- **Textos da interface:** `messages/en.json` e `messages/pt.json` (as chaves precisam bater; o teste confere).
- **Conteúdo do currículo:** `src/content/base.ts` (empresas, datas, stacks, skills) e `src/content/{en,pt}.ts` (textos traduzidos). A ordem em `base.ts` é a do terminal: trabalho principal (vira `HEAD -> main`), projeto paralelo (`sideProject: true`, vira o branch `side/...`) e depois as anteriores.
- **Estudos de caso:** `src/content/projects.base.ts` (ordem, empresa, demo e stack) e `src/content/projects.{en,pt}.ts` (textos). As páginas ficam em `/[locale]/projects/[slug]`; slugs desconhecidos viram 404 no `src/proxy.ts`.
- **Demos interativas:** `src/components/demos/`: grade da Electrolux, loja multimarca da BMW (VIN, vestuário da Motorrad, carrinho) e Movio (fluxo spec → PR → OTA ligado ao app do entregador). Todas usam dados fictícios.
- **Terminal da experiência:** `src/components/experience/GitLog.tsx` (grafo, prompt fixo e commits) e `Experience.tsx` (refs, hashes e lanes).
- **Ícones de tecnologia:** `src/components/TechIcon.tsx` (Simple Icons para marcas, Lucide para o resto). Um teste falha se alguma skill ou stack ficar sem ícone.
- **Cores e tipografia:** tokens em `src/app/globals.css` (`.dark` e `.light`).

## Deploy

Na Vercel, defina `NEXT_PUBLIC_SITE_URL` com o domínio final (usado em canonical, hreflang, sitemap e Open Graph). Sem ela, o site usa a URL de produção da Vercel.
