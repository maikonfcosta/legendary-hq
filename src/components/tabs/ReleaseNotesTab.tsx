import { Tag, CheckCircle2, Star, Rocket } from 'lucide-react';

const releases = [
  {
    version: "1.2.1",
    date: new Date().toLocaleDateString('pt-BR'),
    title: "Refinamento Visual 🖌️",
    description: "Pequenos ajustes na experiência do usuário e interface.",
    highlights: [],
    features: [
      "Customização global da barra de rolagem (Scrollbar) idêntica à interface do Marvel Champions."
    ]
  },
  {
    version: "1.2.0",
    date: new Date().toLocaleDateString('pt-BR'),
    title: "TopBar, Configurações e Temas 🎨",
    description: "Expansão da navegação com uma nova barra de controle e personalização visual profunda.",
    highlights: [
      {
        icon: <Rocket size={18} style={{ color: 'var(--primary-color)' }} />,
        text: "Sistema de Temas Dinâmicos: Aplicação de estilos baseados nos arquétipos (Covert, Instinct, Ranged, Strength e Tech)."
      },
      {
        icon: <Star size={18} style={{ color: '#fbc02d' }} />,
        text: "Painel de Configurações: Centralização das preferências de usuário, incluindo controle de SFX e gerenciamento de conta."
      }
    ],
    features: [
      "Migração do Login, Status da Nuvem e Idioma para uma Barra Superior (TopBar).",
      "Painel de Configurações adicionado (Ícone de Engrenagem).",
      "Inclusão de Efeitos Sonoros (SFX) nos cliques com opção de Mutar."
    ]
  },
  {
    version: "1.1.0",
    date: "13 de Julho de 2026",
    title: "UI Premium, Estatísticas & Quality of Life ✨",
    description: "Uma camada massiva de polimento visual e a aguardada aba de Estatísticas globais.",
    highlights: [
      {
        icon: <Rocket size={18} style={{ color: 'var(--primary-color)' }} />,
        text: "Estatísticas & Histórico Avançado: Cálculo automático de Win Rate, gráficos coloridos e a capacidade de adicionar partidas retroativas."
      },
      {
        icon: <Star size={18} style={{ color: '#fbc02d' }} />,
        text: "UI Premium & Novo Layout: A página inicial foi transformada em um painel informativo organizado, e o menu lateral agora conta com card de Perfil no topo."
      }
    ],
    features: [
      "Lançamento do Changelog Interativo (Release Notes) no rodapé do aplicativo.",
      "Proteção anti-crash no Firebase para funcionamento perfeito em ambiente local.",
      "Layout do rodapé fixo e centralização fluida do conteúdo principal em telas largas."
    ]
  },
  {
    version: "1.0.0",
    date: "Sexta-feira (Julho de 2026)",
    title: "O Lançamento Oficial do Legendary HQ 🚀",
    description: "A grande atualização que transformou o projeto em uma verdadeira Central de Comandos.",
    highlights: [
      {
        icon: <Rocket size={18} style={{ color: 'var(--primary-color)' }} />,
        text: "Setup Randomizer Completo: Motor capaz de sortear perfeitamente Masterminds, Schemes, Vilões e Heróis."
      },
      {
        icon: <Star size={18} style={{ color: '#fbc02d' }} />,
        text: "Game Tracker Robusto: Controle de pontos de recrutamento, ataque e Master Strikes, com envio de dados de vitória direto para a nuvem."
      },
      {
        icon: <CheckCircle2 size={18} style={{ color: '#10b981' }} />,
        text: "Nuvem Firebase e Autenticação: Seu histórico e lista de expansões protegidos e sincronizados pelo Login do Google."
      }
    ],
    features: [
      "Integração PWA (Progressive Web App) para experiência nativa.",
      "Sincronização Offline-first das Expansões.",
      "Criação de contextos de autenticação (AuthContext) e hooks customizados."
    ]
  },
  {
    version: "0.1.0",
    date: "Alpha Build",
    title: "Fundação do Quartel General 🏗️",
    description: "A base técnica e estrutural onde o aplicativo começou a ser desenhado.",
    highlights: [
      {
        icon: <CheckCircle2 size={18} style={{ color: '#10b981' }} />,
        text: "Arquitetura Sólida: Setup inicial com Vite, React 19, testes automatizados rigorosos e regras de CI/CD."
      }
    ],
    features: [
      "Base de dados JSON contendo todas as cartas iniciais mapeadas.",
      "Sistema de navegação (abas) e componentes modulares da UI inicial."
    ]
  }
];

export function ReleaseNotesTab() {
  return (
    <div className="fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'white' }}>Notas de Atualização</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Histórico de versões e novidades do Legendary HQ</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {releases.map((release, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary-color)' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: 'rgba(230,36,41,0.2)', color: 'var(--primary-color)', padding: '6px 16px', borderRadius: '24px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={18} />
                  v{release.version}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{release.date}</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'white' }}>{release.title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px', fontSize: '1.05rem' }}>
              {release.description}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={20} style={{ color: 'var(--primary-color)' }} /> Destaques
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}>
                {release.highlights.map((h, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px' }}>{h.icon}</div>
                    <span style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{h.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '12px' }}>Outras Melhorias</h3>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {release.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
