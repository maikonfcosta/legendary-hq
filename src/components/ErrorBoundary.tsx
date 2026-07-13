import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '2rem' }}>
          <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>Ops! Algo deu errado.</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
            Ocorreu um erro inesperado ao renderizar esta tela. 
            <br/><br/>
            <code style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '4px', display: 'block', color: '#ef4444' }}>
              {this.state.error?.message}
            </code>
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={20} /> Recarregar Aplicativo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
