# Plano Estruturado: Refinamento UI/UX do Tracker 🎨

O módulo *Tracker* é a tela onde os jogadores passam a maior parte do tempo durante a partida. O objetivo deste refinamento é deixá-lo **mais tátil, vivo e imersivo**, ajudando na experiência da mesa.

### 1. Animações de Micro-interação (Feedback Visual)
- **Pulse Effect:** Toda vez que o jogador aumentar ou diminuir um número (Recrutamento, Ataque, Strikes), o número fará uma leve animação de pulsação (`pop/scale`), dando um feedback tátil de que o clique foi computado.
- **Transições Suaves:** Botões de `+` e `-` terão efeitos de *glow* (brilho externo) com a cor correspondente de cada painel ao passar o mouse, e não apenas uma cor primária genérica.

### 2. Destaque dos Recursos Principais
- Melhoria dos painéis de **Attack** e **Recruit**. Hoje eles usam os botões genéricos `.btn`. Vamos aplicar estilos circulares e botões translúcidos (Glassmorphism avançado) com as cores de cada elemento (Vermelho e Amarelo), deixando-os muito mais parecidos com mostradores de uma nave do que com formulários web.

### 3. Modo Alerta (Tensão de Fim de Jogo)
- **Feedback de Perigo:** Quando o número de *Master Strikes* ou *Scheme Twists* chegar a **5 ou mais** (geralmente indicando que os jogadores estão prestes a perder), o card desse vilão começará a pulsar sutilmente em vermelho/laranja nas bordas, aumentando a imersão e urgência da mesa.

### 4. Botões de Ação Dinâmicos
- Os botões no topo do Tracker (Concluir Partida, Limpar, Multiplayer) receberão alinhamento e ícones com animações leves ao Hover, garantindo clareza sem poluir a interface.

---
**Próximos Passos:** 
Aguardando a sua validação. Se aprovado, irei adicionar as animações no `index.css` e editar o `TrackerTab.tsx` para plugar os efeitos!
