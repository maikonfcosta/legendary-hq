# Legendary HQ - Contexto e Instruções para Agentes de IA

Este arquivo serve como **"Contexto Mestre"** para qualquer IA (Gemini, Copilot, ChatGPT, Claude) que for trabalhar ou realizar manutenção neste projeto.

## 1. Sobre o Projeto
O **Legendary HQ** é um WebApp criado de fãs para fãs, desenhado como o quartel general definitivo para acompanhar e gerenciar o *Marvel Legendary Deck-Building Game* e suas expansões. Ele compartilha o mesmo "DNA visual" (UI/UX) do app irmão *Marvel Champions Helper*, possuindo as mesmas nomenclaturas e disposição de layouts (Glassmorphism, Menus Laterais, Cores Neon).

## 2. Stack Tecnológica
- **Framework Core:** React 19, TypeScript e Vite.
- **Estilização:** CSS Vanilla moderno (variáveis nativas, `index.css`, Flexbox e CSS Grid).
- **Ícones:** `lucide-react`.
- **Backend/BaaS:** Firebase
  - **Firebase Authentication:** Auth com Google.
  - **Firestore DB:** Sincronização em nuvem da Coleção do usuário e do Histórico de partidas.

## 3. Arquitetura de Componentes
O app opera como um Single Page Application (SPA), ancorado no `src/App.tsx`.
Os módulos de navegação ficam no diretório `src/components/tabs/`:
- `HomeTab.tsx`: Dashboard inicial com atalhos de grid.
- `CollectionTab.tsx`: Inventário de expansões que o jogador possui.
- `RandomizerTab.tsx`: Motor lógico que sorteia cenários, mastermind e vilões de forma balanceada, baseado nas expansões da coleção.
- `TrackerTab.tsx`: Mesa virtual de rastreamento de pontos (Ataque, Recrutamento) e Master Strikes/Esquemas.
- `StatsTab.tsx`: Aba com gráfico (recharts) e histórico detalhado das partidas (vitórias/derrotas).
- `RulesTab.tsx`: Acervo de PDFs ou descrições das regras originais da editora.
- `ReleaseNotesTab.tsx`: Componente isolado que exibe as notas de atualizações do aplicativo (Patch Notes).

## 4. Regras Absolutas e Globais (NÃO IGNORE)

### 🚨 REGRA DE OURO DO FLUXO DE TRABALHO: COMMIT E RELEASE NOTES
Toda vez que você receber uma tarefa, implementar funcionalidades ou resolver um bug, no momento em que for **fazer o COMMIT e o PUSH para a branch `main`**, você **DEVE OBRIGATORIAMENTE:**

1. **Atualizar a versão global do App:** Vá no arquivo `package.json` e faça o incremento da versão (`"version": "1.2.0"`, por exemplo) seguindo versionamento semântico (SemVer).
2. **Atualizar o Release Notes UI:** Vá no arquivo `src/components/tabs/ReleaseNotesTab.tsx` e crie um **novo objeto** no array de releases, descrevendo as novas features/correções exatamente como as alterações que você fez.
3. Isso garante que a UI e o Footer (`App.tsx`) automaticamente reflitam a nova versão lançada e que o usuário saiba as novidades que acabaram de chegar.

### 🎨 REGRA DE UI/UX (Consistência Visual)
Qualquer novo componente deve seguir a arquitetura Glassmorphism estabelecida no `index.css`:
- Botões primários usam `.btn-primary` ou `.btn-secondary`.
- Painéis e cards devem usar a classe `.glass-panel`.
- Nunca injete estilos inline poluídos para layout (como margens grandes ou flexbox complexos); prefira usar ou criar classes globais no `index.css` equivalentes às estruturadas na "Família" do *Marvel Champions*.

### 💽 REGRA DE PERSISTÊNCIA DE DADOS
- O projeto usa uma abordagem de "Cache First" (Primeiro salva no `localStorage` via hooks de React, para que funcione Offline) e depois sincroniza na nuvem pelo **Firestore** caso o usuário esteja autenticado. Não quebre essa engrenagem dupla ao construir novos módulos que guardem informações do jogador.
