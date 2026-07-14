import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line no-console
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      // eslint-disable-next-line no-console
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'var(--surface-color)',
      border: '1px solid var(--primary-color)',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '300px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {needRefresh ? <><RefreshCw size={18} /> Atualização Disponível</> : 'App Pronto (Offline)'}
        </h4>
        <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>
      
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        {needRefresh 
          ? 'Uma nova versão do Legendary HQ está disponível. Atualize para receber os conteúdos mais recentes.' 
          : 'O aplicativo foi instalado em cache e agora funciona sem internet.'}
      </p>

      {needRefresh && (
        <button 
          className="btn btn-primary" 
          onClick={() => updateServiceWorker(true)}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
        >
          Atualizar Agora
        </button>
      )}
    </div>
  );
}
