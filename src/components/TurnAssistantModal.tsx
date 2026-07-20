import { useState, useEffect } from 'react';
import { X, AlertTriangle, Play, FastForward, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface TurnAssistantModalProps {
  onClose: () => void;
}

const STEPS = [
  {
    title: '1. Fase do Vilão',
    desc: (
      <>
        Revele a carta do topo do <strong>Villain Deck</strong>.
        <br/><br/>
        • Se for <strong>Vilão</strong>: Adicione ao HQ. Empurre os outros. Se alguém fugir (Escape), resolva o efeito de Escape (KO em herói do HQ de custo 6 ou menos).
        <br/>
        • Se for <strong>Bystander</strong>: Capture no vilão mais próximo do Mastermind.
        <br/>
        • Se for <strong>Scheme Twist</strong> ou <strong>Master Strike</strong>: Resolva o texto correspondente.
      </>
    ),
    icon: <AlertTriangle size={40} color="#e62429" />
  },
  {
    title: '2. Fase do Jogador',
    desc: (
      <>
        Jogue as cartas da sua mão em qualquer ordem.
        <br/><br/>
        • Use pontos de <strong>Recrute (⭐)</strong> para comprar heróis do HQ ou SHIELD Officers.
        <br/>
        • Use pontos de <strong>Ataque (⚔️)</strong> para derrotar Vilões na cidade ou o Mastermind.
        <br/>
        • Ative habilidades de classes (<span style={{color:'#e62429'}}>Covert</span>, <span style={{color:'#fbc02d'}}>Instinct</span>, etc.) se tiver jogado uma carta da mesma classe antes no turno.
      </>
    ),
    icon: <Play size={40} color="#10b981" />
  },
  {
    title: '3. Fim de Turno',
    desc: (
      <>
        Conclua suas ações e prepare o próximo turno.
        <br/><br/>
        • Coloque todas as cartas que jogou e as cartas restantes na sua mão em sua pilha de descarte (<strong>Discard Pile</strong>).
        <br/>
        • Compre <strong>6 novas cartas</strong> do seu baralho (Deck). Se acabar, embaralhe o descarte para formar um novo baralho.
      </>
    ),
    icon: <FastForward size={40} color="#94a3b8" />
  }
];

export function TurnAssistantModal({ onClose }: TurnAssistantModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
  }, []);

  const step = STEPS[currentStep];
  if (!step) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative', padding: '0' }}>
        
        <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(13, 17, 23, 0.95)', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Assistente de Turno</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '50%' }}>
              {step.icon}
            </div>
          </div>
          
          <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>
            {step.title}
          </h3>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, minHeight: '120px', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
            {step.desc}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
            <button 
              onClick={handlePrev} 
              disabled={currentStep === 0}
              className="btn"
              style={{ background: 'transparent', border: '1px solid var(--surface-border)', opacity: currentStep === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} /> Anterior
            </button>
            
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {currentStep + 1} de {STEPS.length}
            </span>
            
            <button 
              onClick={handleNext} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {currentStep === STEPS.length - 1 ? 'Concluir' : 'Próximo'}
              {currentStep === STEPS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
