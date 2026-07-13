# Ideias para Legendary HQ (Baseado no Marvel Champions Helper)

Abaixo estão as principais funcionalidades implementadas no **Marvel Champions Helper** que podem ser aplicadas no **Legendary HQ**. Elas foram organizadas e priorizadas da **mais fácil e rápida** para a **mais difícil e demorada**.

---

## 🟢 Nível 1: Vitórias Rápidas (Fácil e Rápido)
*Funcionalidades de baixo esforço que dão muito valor imediato.*

### 1. Sincronização e Prompt de Atualização (PWA)
- **O que é:** O componente `ReloadPrompt.jsx` informa quando há uma versão nova do app em cache e pede para recarregar.
- **Como aplicar:** O projeto já tem Vite PWA configurado. É basicamente plugar o componente para garantir que os usuários sempre vejam seus updates imediatamente no celular sem precisarem limpar o cache manualmente.

### 2. Customização do Perfil (Avatar do Usuário)
- **O que é:** Escolher um Avatar de perfil para ficar na barra superior e no menu lateral.
- **Como aplicar:** Já temos todas as imagens de caixas e cartas salvas. Só precisaríamos de um modal onde o usuário escolhe sua "Carta Favorita" (ex: Wolverine) e salvamos esse ID no perfil do Firebase dele. 

### 3. Assistente de Turno (Turn Assistant / Referência Rápida)
- **O que é:** Um componente lateral flutuante que dita o passo a passo de um turno (Fase do Vilão, Fugas, Fase dos Jogadores).
- **Como aplicar:** Em vez de fazer a pessoa ler o manual na aba de Regras, podemos colocar um botão de interrogação `(?)` no *Tracker* que abre um resumo do que ela deve fazer naquela etapa, ajudando muito os iniciantes a não esquecerem regras críticas (tipo nocautear heróis de custo 6 quando um refém foge).

---

## 🟡 Nível 2: Desafios Médios (Esforço Moderado)
*Exigem novas lógicas no Firebase ou processamento pesado de dados na UI.*

### 4. Setups Salvos / Desafios da Comunidade
- **O que é:** Interface para montar e guardar setups de partidas customizadas (análogo à Galeria de Decks do MC).
- **Como aplicar:** O jogador poderia salvar manualmente uma combinação que achou legal (Ex: "Guerras Secretas: Mastermind X, Heróis Y"), e isso seria salvo no Firebase dele. Permite que ele "Carregue" esse setup direto pro Tracker em outro dia, sem depender do Gerador Aleatório.

### 5. Dashboard de Conquistas e Troféus (Mastery)
- **O que é:** Aba para gamificar o jogo, premiando o jogador por marcos e proficiências.
- **Como aplicar:** Você teria um Perfil Gamer (nível). Lendo todo o Histórico do usuário, o sistema desbloquearia emblemas/troféus: (Ex: *"Mestre do Aranha" -> Venceu 10 partidas usando Peter Parker*, ou *"Salvador do Multiverso" -> Venceu o Galactus no modo Solo*). Exige bolar as conquistas num JSON e a UI para elas.

---

## 🔴 Nível 3: Grandes Empreitadas (Difícil e Demorado)
*Mudanças profundas de arquitetura, dados ou estado prolongado.*

### 6. Internacionalização (i18n)
- **O que é:** Suportar Inglês, Português e Espanhol de forma nativa com uma chave de troca na UI.
- **Como aplicar:** Extremamente demorado porque exigiria traduzir não só a UI inteira do site (que é rápido usando o `i18next`), mas sim traduzir **os +600 nomes e textos dentro do `cards.json`**, exigindo uma arquitetura de json multilíngue. Porém, abriria o app pro mundo inteiro usar.

### 7. Modo Campanha Narrativa (Campaign Tracker)
- **O que é:** Sistema prolongado de partidas interconectadas.
- **Como aplicar:** A feature mais épica, porém mais difícil. Precisaríamos montar uma aba inteira de Campanhas onde o jogador "salva" seu progresso após o jogo 1 e leva atributos, heróis ou reféns resgatados para o jogo 2, gerindo toda uma "Run" de campanha sem perder o state. Seria praticamente um "Modo História" para o jogo de tabuleiro.
