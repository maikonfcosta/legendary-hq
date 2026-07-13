import packageJson from '../../../package.json';

export function ReleaseNotesTab() {
  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px' }}>
        Release Notes
      </h2>
      
      <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--surface-border)', borderTop: '4px solid var(--primary-color)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary-color)' }}>v{packageJson.version}</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Julho de 2026</span>
        </div>
        
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
          <li>Lançamento inicial do aplicativo <strong>Legendary HQ</strong>.</li>
          <li>Inclusão do <strong>Setup Randomizer</strong> para partidas aleatórias perfeitamente equilibradas.</li>
          <li><strong>Game Tracker</strong> com contadores integrados de Recrutamento, Ataque, Master Strikes e Esquemas.</li>
          <li><strong>Estatísticas</strong> e <strong>Histórico de Partidas</strong> sincronizados na nuvem em tempo real (Firebase).</li>
          <li>Interface moderna, escura e fluida (Glassmorphism), otimizada para uso em mesa e celular (PWA).</li>
        </ul>
      </div>
    </div>
  );
}
