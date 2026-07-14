import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Lock, Play, CheckCircle2 } from 'lucide-react';
import campaignsData from '../../data/campaigns.json';
import { useCampaignProgress } from '../../hooks/useCampaignProgress';
import { generateCampaignSetup } from '../../utils/randomizer';
import { SetupDecklistModal } from '../SetupDecklistModal';
import type { SetupResult } from '../../utils/randomizer';

interface CampaignsTabProps {
  onPlaySetup: (setup: SetupResult, campaignId: string, missionId: string) => void;
  onRegisterMatch: (setup: SetupResult, victory: boolean, score: number | undefined, pCount: number, campaignId: string, missionId: string) => void;
  ownedExpansions: string[];
}

export function CampaignsTab({ onPlaySetup, onRegisterMatch, ownedExpansions }: CampaignsTabProps) {
  const { t } = useTranslation();
  const { progress } = useCampaignProgress();
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [playerCount, setPlayerCount] = useState(2);
  
  const [setupToView, setSetupToView] = useState<{
    id: string;
    name: string;
    setup: SetupResult;
    createdAt: number;
    campaignId: string;
    missionId: string;
  } | null>(null);

  const handlePlayMission = (mission: any) => {
    try {
      const setup = generateCampaignSetup(playerCount, ownedExpansions, mission.setup);
      setSetupToView({
        id: `campaign_${selectedCampaign.id}_${mission.id}`,
        name: mission.title,
        setup,
        createdAt: Date.now(),
        campaignId: selectedCampaign.id,
        missionId: mission.id
      });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    }
  };

  if (selectedCampaign) {
    const completedMissions = progress[selectedCampaign.id] || [];
    
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => setSelectedCampaign(null)} className="btn btn-secondary">
            &larr; Voltar
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Jogadores:</span>
            <select 
              value={playerCount} 
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="glass-select"
              style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px' }}
            >
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        
        <div className="page-header" style={{ marginBottom: '32px' }}>
          <h2 className="page-title">{selectedCampaign.title}</h2>
          <p className="page-subtitle">{selectedCampaign.description}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedCampaign.missions.map((mission: any, index: number) => {
            const isCompleted = completedMissions.includes(mission.id);
            // First mission is always unlocked, others unlock if previous is completed
            const isUnlocked = index === 0 || completedMissions.includes(selectedCampaign.missions[index - 1].id);

            return (
              <div key={mission.id} className="glass-panel" style={{ padding: '24px', opacity: isUnlocked ? 1 : 0.6, borderLeft: isCompleted ? '4px solid #10b981' : isUnlocked ? '4px solid #3b82f6' : '4px solid #475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', margin: '0 0 12px 0' }}>
                      {isCompleted ? <CheckCircle2 size={20} color="#10b981" /> : !isUnlocked ? <Lock size={20} color="#94a3b8" /> : <Play size={20} color="#3b82f6" />}
                      {mission.title}
                    </h3>
                    
                    {isUnlocked && (
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          <strong style={{ color: '#ef4444' }}>Mastermind:</strong> {mission.setup.mastermind}
                        </div>
                        <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                          <strong style={{ color: '#f97316' }}>Scheme:</strong> {mission.setup.scheme}
                        </div>
                        {mission.setup.heroRestrictions && (
                          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <strong style={{ color: '#3b82f6' }}>Restrição de Heróis:</strong> {mission.setup.heroRestrictions}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isUnlocked && !isCompleted && (
                    <button 
                      onClick={() => handlePlayMission(mission)} 
                      className="btn btn-primary"
                    >
                      Jogar
                    </button>
                  )}
                  {isCompleted && (
                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                      Concluída
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {setupToView && (
          <SetupDecklistModal 
            setupData={setupToView} 
            onClose={() => setSetupToView(null)} 
            onPlayTracker={(s) => {
              const { campaignId, missionId } = setupToView;
              setSetupToView(null);
              onPlaySetup(s, campaignId, missionId);
            }}
            onRegisterMatch={(s, v, sc, pCount) => {
              const { campaignId, missionId } = setupToView;
              setSetupToView(null);
              onRegisterMatch(s, v, sc, pCount || playerCount, campaignId, missionId);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ alignItems: 'center', textAlign: 'center', display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
        <Map size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
        <h2 className="page-title">{t('sidebar.campaigns', 'Campanhas')}</h2>
        <p className="page-subtitle">Enfrente desafios narrativos em sequência.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {campaignsData.map((campaign: any) => {
          const totalMissions = campaign.missions.length;
          const completedMissions = (progress[campaign.id] || []).length;
          const percentage = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
          
          const requiredExpansions: string[] = campaign.requiredExpansions || ['core'];
          const isUnlocked = requiredExpansions.every(exp => 
            ownedExpansions.includes(exp) || (exp === 'core' && ownedExpansions.includes('core_2nd'))
          );

          return (
            <div 
              key={campaign.id} 
              className="glass-panel" 
              style={{ 
                padding: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: isUnlocked ? 'pointer' : 'not-allowed', 
                transition: 'transform 0.2s ease', 
                border: '1px solid rgba(255,255,255,0.05)',
                opacity: isUnlocked ? 1 : 0.6
              }} 
              onClick={() => isUnlocked && setSelectedCampaign(campaign)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!isUnlocked && <Lock size={18} color="#ef4444" />}
                  {campaign.title}
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>{campaign.description}</p>
              
              <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {requiredExpansions.map(exp => {
                  const hasExp = ownedExpansions.includes(exp) || (exp === 'core' && ownedExpansions.includes('core_2nd'));
                  return (
                    <span key={exp} style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      background: hasExp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: hasExp ? '#10b981' : '#ef4444',
                      border: `1px solid ${hasExp ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {exp === 'core' ? 'Core Set' : exp === 'dark_city' ? 'Dark City' : exp}
                    </span>
                  );
                })}
              </div>
              
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
                  <span style={{ color: 'white', fontWeight: 600 }}>{completedMissions} / {totalMissions}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.4)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${percentage}%`, background: percentage === 100 ? '#10b981' : 'var(--primary-color)', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
