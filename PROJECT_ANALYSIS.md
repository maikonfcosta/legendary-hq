# Análise Completa do Projeto — Legendary HQ

> **Propósito deste documento:** servir de contexto/instrução para uma CLI de IA (ou desenvolvedor) executar as melhorias do projeto. Cada item traz o problema, a evidência (arquivo/linha) e a ação recomendada.
>
> **Data da análise:** 2026-07-12 · **Commit base:** `56aaef7`

---

## 1. Visão Geral do Projeto

**Legendary HQ** é um SPA (Single Page Application) assistente para o jogo de cartas *Legendary: A Marvel Deck Building Game*: randomizer de setup, game tracker, gerenciador de coleção e leitor de manuais em PDF.

### Stack

| Camada | Tecnologia |
|---|---|
| UI | React 19 (`react`, `react-dom`) |
| Linguagem | TypeScript ~6.0 |
| Build | Vite 8 (`tsc -b && vite build`) |
| Lint | Oxlint 1.x (`.oxlintrc.json`) |
| Ícones | lucide-react |
| Estilo | CSS puro (`src/index.css`, glassmorphism) + muitos estilos inline |
| Dados | JSON estáticos (`src/data/cards.json`, `src/data/imageDB.json`) |

### Estrutura atual

```
legendary-hq/
├── src/
│   ├── App.tsx              (440 linhas — monolito com 6 "páginas" inline)
│   ├── main.tsx
│   ├── index.css            (458 linhas)
│   ├── components/Rules.tsx (404 linhas — regras + acervo de PDFs)
│   ├── data/cards.json      (84 KB — 40 expansões, 76 masterminds, 115 schemes, 80 vilões, 35 henchmen, 193 heróis)
│   ├── data/imageDB.json    (884 KB — mapa nome-de-arquivo → URL externa de CDN)
│   ├── types/index.ts       (interfaces do domínio)
│   └── utils/               (randomizer.ts, imageLookup.ts)
├── public/docs/             (196 MB de PDFs de regras!)
├── scraper.cjs, scraper2.cjs, imageScraper.cjs, updateExpansions.cjs  (scripts de scraping na raiz)
├── master-strike-app.js     (bundle minificado de 1.2 MB de OUTRO app — lixo)
├── core_set.html, repo_tree.json  (artefatos de scraping)
└── README.md, LICENSE, configs
```

### Estado de saúde verificado

| Verificação | Resultado |
|---|---|
| `npm run build` (tsc + vite) | ✅ Passa |
| `npm run lint` (oxlint) | ⚠️ Passa, mas poluído por milhares de warnings vindos de `master-strike-app.js` |
| Testes | ❌ Inexistentes (nenhum framework instalado) |
| CI/CD | ❌ Inexistente (sem `.github/workflows`) |
| Bundle final | ⚠️ 1.153 MB JS (warning do Vite de chunk > 500 kB) |

---

## 2. Problemas Críticos (corrigir primeiro)

### 2.1 Nenhuma persistência de dados — a coleção do usuário se perde ao recarregar
- **Evidência:** `src/App.tsx:15` — `ownedExpansions` vive apenas em `useState`. O mesmo vale para todos os contadores do Game Tracker (linhas 18–22).
- **Impacto:** a funcionalidade central "Minha Coleção" é inutilizável na prática: a cada F5 o usuário volta para `['core', 'core_2nd']`.
- **Ação:** persistir `ownedExpansions` e o estado do tracker em `localStorage` (hook `useLocalStorage` ou `useEffect` de sincronização). Considerar um contexto (`CollectionContext`) para não passar props manualmente.

### 2.2 TypeScript sem `strict` mode
- **Evidência:** `tsconfig.app.json` não possui `"strict": true` (nem `noImplicitAny`, `strictNullChecks`). O código já contém escapes: `catch (e: any)` em `src/App.tsx:44`, `(imageDB as any)` em `App.tsx:52` e `App.tsx:392`, `(exp as any).image` em `App.tsx:391`.
- **Ação:** habilitar `"strict": true` e `"noUncheckedIndexedAccess": true`; tipar `cards.json`/`imageDB.json` via `CardDatabase` e `Record<string, string>` (os tipos já existem em `src/types/index.ts`); remover todos os `as any`.

### 2.3 Lixo no repositório raiz
- **Evidência:**
  - `master-strike-app.js` — bundle webpack minificado de 1.2 MB que não pertence a este projeto (gera milhares de warnings no lint).
  - `core_set.html`, `repo_tree.json` — artefatos intermediários de scraping.
  - `scraper.cjs`, `scraper2.cjs`, `imageScraper.cjs`, `updateExpansions.cjs` — scripts utilitários soltos na raiz (`scraper.cjs:2` ainda tem `fs` importado sem uso).
- **Ação:** deletar `master-strike-app.js`, `core_set.html` e `repo_tree.json`; mover os scrapers para `scripts/` e adicioná-los ao `ignorePatterns` do oxlint (ou corrigi-los); documentar no README quando/como rodá-los.

### 2.4 196 MB de PDFs versionados no Git
- **Evidência:** `public/docs/` contém 41 PDFs (vários acima de 10–25 MB cada).
- **Impacto:** clone lento, limite do GitHub próximo (arquivos > 25 MB), deploy pesado.
- **Ação (escolher uma):**
  1. Migrar para **Git LFS**; ou
  2. Hospedar os PDFs externamente (R2/S3/GitHub Releases) e referenciar por URL; ou
  3. No mínimo, comprimir os PDFs não comprimidos (`Annihilation_Rules.pdf` 25 MB, `2022-BlackPanther_Rulesheet.pdf` 25 MB, `WhatIf_Rulebook.pdf` 23 MB).

### 2.5 Bundle JS de 1.15 MB — `imageDB.json` importado estaticamente
- **Evidência:** `src/App.tsx:8` e `src/utils/imageLookup.ts:1` importam `imageDB.json` (884 KB) direto no bundle; build emite warning de chunk > 500 kB.
- **Ação:** carregar `imageDB.json` de forma lazy (`import()` dinâmico ou fetch de `/data/imageDB.json` em `public/`), ou pré-resolver as imagens em build-time gravando a URL final dentro de `cards.json` (elimina o lookup fuzzy em runtime — ver 3.2).

---

## 3. Problemas de Arquitetura e Código

### 3.1 `App.tsx` monolítico (440 linhas, 6 páginas inline)
- Home, Randomizer, Tracker, Stats, Collection e Rules estão todos dentro de um único componente com navegação por string state (`activeTab`).
- **Ação:** extrair para `src/components/` (ou `src/pages/`): `HomeTab.tsx`, `RandomizerTab.tsx`, `TrackerTab.tsx`, `StatsTab.tsx`, `CollectionTab.tsx`. Extrair também componentes reutilizáveis: `Counter` (o bloco +/− se repete 5× no tracker), `SetupCard` (o `renderCard`), `NavLink`.
- Opcional: adotar `react-router` para deep-links (`/tracker`, `/rules`), útil já que o app é usado no celular durante partidas.

### 3.2 Lookup de imagem por fuzzy matching em runtime
- **Evidência:** `src/utils/imageLookup.ts` — para cada carta renderizada, normaliza e varre **todas** as ~milhares de chaves do `imageDB`, com sistema de pontuação heurística (penalidades para variantes "mcu", "noir", "zombie"...).
- **Problemas:** custo O(n) por carta por render; resultados frágeis (nomes ambíguos podem casar com a carta errada); imagens **hotlinkadas de CDN de terceiros** (squarespace-cdn.com) — podem quebrar ou bloquear hotlink a qualquer momento.
- **Ação:** rodar o matching **uma vez em build-time** (script em `scripts/`) e gravar `image` resolvida em `cards.json`; memoizar o que restar de lookup dinâmico; avaliar hospedar as imagens localmente ou aceitar formalmente o risco do hotlink.

### 3.3 Shuffle estatisticamente viciado
- **Evidência:** `src/utils/randomizer.ts:18` — `[...filtered].sort(() => 0.5 - Math.random())` não produz permutação uniforme.
- **Ação:** implementar Fisher–Yates.

### 3.4 Validação incompleta no randomizer
- **Evidência:** `src/utils/randomizer.ts:43` valida apenas masterminds, schemes e heróis. Se o usuário tiver poucas expansões, `villains`/`henchmen` podem vir em quantidade menor que a config exige, silenciosamente.
- **Ação:** validar também `availableVillains.length >= config.villains` e `availableHenchmen.length >= config.henchmen`, com mensagem de erro específica.

### 3.5 Aba "Estatísticas" é placeholder hardcoded
- **Evidência:** `src/App.tsx:185–249` — números fixos em `0`, textos "Nenhum dado registrado", mas a aba aparece na navegação como funcionalidade real.
- **Ação (escolher):** implementar de verdade (salvar partidas finalizadas do Tracker em `localStorage` e agregar) **ou** ocultar a aba/tag como "Em breve" até existir.

### 3.6 UX com `alert()` / `confirm()` nativos
- **Evidência:** `src/App.tsx:25` (`confirm`) e `App.tsx:45` (`alert`).
- **Ação:** substituir por modal/toast próprios (o design system glassmorphism já existe no CSS).

### 3.7 Estilos inline em excesso
- **Evidência:** dezenas de `style={{...}}` extensos em `App.tsx` e `Rules.tsx` duplicando padrões (cards do tracker, painéis de stats).
- **Ação:** mover para classes em `index.css` ou adotar CSS Modules; os 4 cards da home e os 5 contadores do tracker devem virar componentes parametrizados.

### 3.8 Sem Error Boundary e sem fallback de imagem
- Uma URL de imagem quebrada (provável, dado o hotlink) renderiza ícone de imagem quebrada; um erro em runtime derruba o app inteiro.
- **Ação:** adicionar `ErrorBoundary` no root e `onError` nos `<img>` com placeholder.

---

## 4. Qualidade, Tooling e Processo

| Item | Estado | Ação recomendada |
|---|---|---|
| **Testes** | ❌ Nenhum | Adicionar Vitest + Testing Library. Prioridade: `randomizer.ts` (lógica pura, fácil de testar — always-leads, contagens por nº de jogadores, erro com coleção insuficiente) e `imageLookup.ts`. |
| **CI** | ❌ Nenhum | GitHub Actions: `lint` + `tsc -b` + `build` + `test` em PRs. |
| **Formatador** | ❌ Nenhum | Adicionar Prettier (ou `oxfmt`) + config no editor. |
| **`cheerio` em `dependencies`** | ⚠️ Errado | Só é usado pelos scrapers Node. Mover para `devDependencies` (`package.json:13`). |
| **Versão do pacote** | `0.0.0` | Adotar versionamento (`0.1.0`) e, idealmente, changelog. |
| **`engines` / `.nvmrc`** | ❌ Ausentes | Fixar versão de Node suportada. |
| **`index.html`** | ⚠️ | `lang="en"` mas o app é pt-BR (`index.html:2`) → `lang="pt-BR"`. Adicionar `<meta name="description">`, Open Graph e usar o `favicon.svg` existente em vez de `logo.jpg` como ícone. |
| **PWA** | ❌ | O README posiciona o app para uso no celular à mesa — `vite-plugin-pwa` + manifest + offline dos dados daria enorme valor. |
| **Acessibilidade** | ⚠️ | Botão hamburger sem `aria-label` (`App.tsx:79`); cards de coleção são `div` clicáveis sem `role="button"`/`tabIndex`/teclado (`App.tsx:395`); contadores sem `aria-live`. |
| **`src/assets`** | ⚠️ | `react.svg`/`vite.svg` são sobras do template; `hero.png` não é referenciado. Limpar. |

---

## 5. O que já está bom (manter)

- ✅ Build e typecheck passam de forma limpa e rápida (<1 s).
- ✅ Stack moderna e enxuta (React 19, Vite 8, TS 6, oxlint) — sem dependências desnecessárias no runtime além de `cheerio` (ver 4).
- ✅ Separação `data / types / utils / components` no `src/` é o esqueleto certo — só falta usá-la com mais rigor.
- ✅ Tipos de domínio bem definidos (`src/types/index.ts`).
- ✅ Lógica de "Always Leads" do mastermind corretamente considerada no randomizer.
- ✅ README claro (pt-BR), LICENSE MIT com disclaimer de propriedade intelectual, `.gitignore` adequado.
- ✅ Oxlint com `react/rules-of-hooks: error` habilitado.
- ✅ UI responsiva com menu mobile e base de design consistente (variáveis CSS).

---

## 6. Plano de Ação Priorizado (roadmap para execução)

Ordem sugerida — cada fase é um PR independente:

**Fase 1 — Higiene do repositório (baixo risco, alto ganho)**
1. Remover `master-strike-app.js`, `core_set.html`, `repo_tree.json`.
2. Mover `*.cjs` de scraping para `scripts/` e corrigir/ignorar no lint.
3. Mover `cheerio` para `devDependencies`; limpar `src/assets`.
4. Corrigir `index.html` (`lang="pt-BR"`, meta description, favicon.svg).
5. Decidir estratégia dos PDFs (LFS / hospedagem externa / compressão).

**Fase 2 — Robustez**
6. Habilitar `strict` no `tsconfig.app.json` e eliminar `as any`.
7. Persistir coleção e tracker em `localStorage`.
8. Corrigir shuffle (Fisher–Yates) e validações do randomizer.
9. Adicionar Vitest + testes de `randomizer.ts` e `imageLookup.ts`.
10. Adicionar GitHub Actions (lint + build + test).

**Fase 3 — Arquitetura**
11. Quebrar `App.tsx` em páginas/componentes; extrair `Counter` e `SetupCard`.
12. Lazy-load do `imageDB.json` (ou resolução de imagens em build-time) para derrubar o bundle abaixo de 500 kB.
13. Substituir `alert`/`confirm` por UI própria; adicionar ErrorBoundary e fallback de imagens.

**Fase 4 — Produto**
14. Implementar Estatísticas de verdade (histórico de partidas em `localStorage`) ou ocultar a aba.
15. PWA (instalável + offline).
16. Acessibilidade (aria-labels, navegação por teclado, `aria-live` nos contadores).

---

## 7. Comandos de referência

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (Vite)
npm run build      # typecheck (tsc -b) + build de produção
npm run lint       # oxlint
npm run preview    # servir o build de produção localmente
```
