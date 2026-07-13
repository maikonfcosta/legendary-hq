import { Tag, CheckCircle2, Star, Rocket } from 'lucide-react';

const releases = [
  {
    version: "1.0.0",
    date: "13 de Julho de 2026",
    title: "O Lançamento Oficial do Legendary HQ 🚀",
    description: "A primeira versão oficial e consolidada da sua Central de Comandos para Marvel Legendary.",
    highlights: [
      {
        icon: <Rocket size={18} style={{ color: 'var(--primary-color)' }} />,
        text: "Design Final & Release Notes: Interface moderna consolidada (Glassmorphism), layout da Home refinado e menu centralizado inspirado na nossa biblioteca raiz."
      }
    ],
    features: [
      "Integração do Changelog (Release Notes) no rodapé do aplicativo.",
      "Proteção anti-crash no Firebase para uso Offline Local.",
      "Correções de tipagem rigorosa (TypeScript Strict Mode) no sistema de navegação."
    ]
  },
  {
    version: "0.9.0",
    date: "Julho de 2026",
    title: "Histórico e Estatísticas Globais 📊",
    description: "Implementação da Fase 4 de nossa engenharia, focada em análise de dados do jogador.",
    highlights: [
      {
        icon: <CheckCircle2 size={18} style={{ color: '#10b981' }} />,
        text: "Estatísticas em Tempo Real: Cálculo automático de Win Rate e exibição gráfica colorida dos seus resultados."
      },
      {
        icon: <Tag size={18} style={{ color: 'var(--secondary-color)' }} />,
        text: "Registro Manual: Adição de partidas retroativas no histórico."
      }
    ],
    features: [
      "Botão de 'Concluir Partida' no Tracker, enviando dados de Vitória/Derrota automaticamente para o Banco.",
      "Hooks customizados (useGameHistory) para salvar partidas no Firestore."
    ]
  },
  {
    version: "0.8.0",
    date: "Julho de 2026",
    title: "A Nuvem & Game Tracker ☁️",
    description: "Reformulação da arquitetura de estados e início da Fase 3.",
    highlights: [
      {
        icon: <Star size={18} style={{ color: '#fbc02d' }} />,
        text: "Autenticação Cloud: Login com Google via Firebase e migração da coleção local para a nuvem."
      },
      {
        icon: <CheckCircle2 size={18} style={{ color: '#10b981' }} />,
        text: "Game Tracker: Controle pontos de recrutamento, ataque e rastreie os Master Strikes sem precisar de tokens físicos."
      }
    ],
    features: [
      "Criação de contextos de autenticação (AuthContext) e Firebase Web SDK.",
      "Sincronização Offline-first das Expansões (useSyncedCollection)."
    ]
  },
  {
    version: "0.1.0",
    date: "Lançamento Inicial",
    title: "Fundação do Quartel General 🏗️",
    description: "Versão protótipo (Fases 1 e 2) contendo as mecânicas cruciais.",
    highlights: [
      {
        icon: <Rocket size={18} style={{ color: 'var(--primary-color)' }} />,
        text: "Setup Randomizer: Motor capaz de sortear Masterminds, Schemes, Vilões, Henchmen e Heróis perfeitamente balanceados."
      }
    ],
    features: [
      "Base de dados JSON com todas as cartas iniciais mapeadas.",
      "Engenharia de Qualidade: Testes Vitest, Linter OXLint e validação pré-commit.",
      "Sistema básico de navegação e componentes modulares."
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
