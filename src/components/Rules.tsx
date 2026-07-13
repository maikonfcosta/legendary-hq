import { useState, useEffect } from 'react'
import { BookOpen, ShieldAlert, Swords, Users, Target, FileText, Download, X } from 'lucide-react'

const PDF_BASE_URL = import.meta.env.VITE_PDF_BASE_URL || 'https://legendary-hq-docs.s3.amazonaws.com/docs';

const pdfManuals = [
  { name: 'Core Set (Inglês)', file: 'legendary_a_marvel_regras_ingles_13288.pdf', type: 'core', id: 'core' },
  { name: 'Core Set 2nd Edition', file: 'Legendary_2ndEdition_Rulebook.pdf', type: 'core', id: 'core_2nd' },
  { name: 'Ant-Man', file: 'Legendary_Rules-Ant-Man.pdf', type: 'expansion', id: 'ant_man' },
  { name: 'Ant-Man & Wasp', file: 'AntMan_Wasp_Rulesheet.pdf', type: 'expansion', id: 'ant_man_wasp' },
  { name: 'Annihilation', file: 'Annihilation_Rules.pdf', type: 'expansion', id: 'annihilation' },
  { name: 'Black Panther', file: '2022-BlackPanther_Rulesheet.pdf', type: 'expansion', id: 'black_panther' },
  { name: 'Black Widow', file: '2022_BlackWidow_Rulesheet.pdf', type: 'expansion', id: 'black_widow' },
  { name: 'Captain America', file: 'Legendary-Captain-America-Rulesheet.pdf', type: 'expansion', id: 'cap_75' },
  { name: 'Champions', file: '17-marvel-legendary-champions-rules.pdf', type: 'expansion', id: 'champions' },
  { name: 'Civil War', file: 'Legendary_Civil_War_Rules.pdf', type: 'expansion', id: 'civil_war' },
  { name: 'Dark City', file: 'Legendary_Rules-Dark_City.pdf', type: 'expansion', id: 'dark_city' },
  { name: 'Deadpool', file: 'Deadpool_RulesSheet.pdf', type: 'expansion', id: 'deadpool' },
  { name: 'Dimensions', file: 'Legendary_Rules-Dimensions.pdf', type: 'expansion', id: 'dimensions' },
  { name: 'Doctor Strange', file: 'Legendary_DoctorStrange_Rulesheet.pdf', type: 'expansion', id: 'doctor_strange' },
  { name: 'Fantastic Four', file: 'Fantastic-4-Rules.pdf', type: 'expansion', id: 'fantastic_four' },
  { name: 'Fear Itself', file: 'Legendary_Rules-Fear_Itself.pdf', type: 'expansion', id: 'fear_itself' },
  { name: 'Guardians of the Galaxy', file: 'Legendary_Rules-Guardians_of_the_Galaxy.pdf', type: 'expansion', id: 'guardians' },
  { name: 'Heroes of Asgard', file: '2020_Marvel_Legendary_HeroesAsgard_Rules_compressed.pdf', type: 'expansion', id: 'heroes_of_asgard' },
  { name: 'Into the Cosmos', file: 'IntoTheCosmos_Rules.pdf', type: 'expansion', id: 'into_the_cosmos' },
  { name: 'Marvel 2099', file: 'Marvel2099_Rulesheet.pdf', type: 'expansion', id: '2099' },
  { name: 'Marvel Studios (First 10 Years)', file: 'Legendary_Rules-Marvel_Studios_the_First_Ten_Years.pdf', type: 'expansion', id: 'phase_1' },
  { name: 'MCU Guardians of the Galaxy', file: 'Lgd_MCU_GOTG_Rulesheet.pdf', type: 'expansion', id: 'mcu_guardians' },
  { name: 'MCU Infinity Saga', file: 'MCU_InfinitySaga_Rulesheet.pdf', type: 'expansion', id: 'infinity_saga' },
  { name: 'MCU Spider-Man Homecoming', file: '2017_Legendary_SMHC_Rules.pdf', type: 'expansion', id: 'spiderman_homecoming' },
  { name: 'Messiah Complex', file: 'Lgd_MessiahComplex_Rulesheet_Compressed.pdf', type: 'expansion', id: 'messiah_complex' },
  { name: 'Midnight Sons', file: 'MidnightSons_Rulesheet.pdf', type: 'expansion', id: 'midnight_sons' },
  { name: 'New Mutants', file: '2020_Marvel_Legendary_NewMutants_Rules_compressed.pdf', type: 'expansion', id: 'new_mutants' },
  { name: 'NOIR', file: '2017_LegendaryNOIR_Rules.pdf', type: 'expansion', id: 'noir' },
  { name: 'Paint The Town Red', file: 'Legendary_Rules-Paint_The_Town_Red.pdf', type: 'expansion', id: 'paint_the_town_red' },
  { name: 'Realm of Kings', file: 'RealmOfKings_Rules_Compressed.pdf', type: 'expansion', id: 'realm_of_kings' },
  { name: 'Revelations', file: '2019_Marvel_Legendary_Revelations_Rules_compressed.pdf', type: 'expansion', id: 'revelations' },
  { name: 'Secret Wars Volume 1', file: 'Legendary_Rules_Secret_Wars_v1.pdf', type: 'expansion', id: 'secret_wars_1' },
  { name: 'Secret Wars Volume 2', file: 'Legendary_Rules_Secret_Wars_v2.pdf', type: 'expansion', id: 'secret_wars_2' },
  { name: 'S.H.I.E.L.D.', file: '2019_Marvel_Legendary_SHIELD_Rules_compressed.pdf', type: 'expansion', id: 'shield' },
  { name: 'Venom', file: 'Legendary_Rules-Venom.pdf', type: 'expansion', id: 'venom' },
  { name: 'Villains', file: 'Legendary_Rules-Villains.pdf', type: 'expansion', id: 'villains' },
  { name: 'Weapon X', file: 'Marvel_WeaponX_Rulesheet.pdf', type: 'expansion', id: 'weapon_x' },
  { name: 'What If...?', file: 'WhatIf_Rulebook.pdf', type: 'expansion', id: 'what_if' },
  { name: 'World War Hulk', file: 'Legendary_Rules-World_War_Hulk.pdf', type: 'expansion', id: 'world_war_hulk' },
  { name: 'X-Men', file: '2017_Legendary_XMen_Rules.pdf', type: 'expansion', id: 'xmen' }
].sort((a, b) => a.name.localeCompare(b.name));

interface RulesProps {
  ownedExpansions: string[];
}

export function Rules({ ownedExpansions }: RulesProps) {
  const [activeRuleTab, setActiveRuleTab] = useState('overview');
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);

  // Impede scroll no body quando o modal está aberto
  useEffect(() => {
    if (selectedPdfUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedPdfUrl]);

  return (
    <div className="rules-container animation-fade-in">
      <header className="result-header">
        <BookOpen size={48} color="var(--primary-color)" />
        <div>
          <h2>Manual de Regras</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            O guia definitivo para derrotar os Super-Vilões e salvar o Universo Marvel.
          </p>
        </div>
      </header>

      {/* Tabs de Navegação das Regras - Padrão UI_UX */}
      <div className="tabs-container" style={{ display: 'flex', gap: '10px', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px' }}>
        <button 
          className={`btn ${activeRuleTab === 'overview' ? 'btn-primary' : ''}`}
          onClick={() => setActiveRuleTab('overview')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
        >
          <Target size={18} />
          Visão Geral
        </button>
        <button 
          className={`btn ${activeRuleTab === 'setup' ? 'btn-primary' : ''}`}
          onClick={() => setActiveRuleTab('setup')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
        >
          <Users size={18} />
          Preparação
        </button>
        <button 
          className={`btn ${activeRuleTab === 'turn' ? 'btn-primary' : ''}`}
          onClick={() => setActiveRuleTab('turn')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
        >
          <Swords size={18} />
          O Turno
        </button>
        <button 
          className={`btn ${activeRuleTab === 'villain' ? 'btn-primary' : ''}`}
          onClick={() => setActiveRuleTab('villain')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
        >
          <ShieldAlert size={18} />
          Super-Vilões
        </button>
        <button 
          className={`btn ${activeRuleTab === 'pdfs' ? 'btn-primary' : ''}`}
          onClick={() => setActiveRuleTab('pdfs')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
        >
          <FileText size={18} />
          Acervo de Manuais (PDFs)
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {activeRuleTab === 'overview' && (
          <div className="rule-content animation-fade-in">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target color="var(--primary-color)" />
              Visão Geral
            </h3>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Bem-vindo a <strong>Legendary</strong>, o jogo de construção de baralhos da Marvel! Super-Vilões como Magneto e Doutor Destino lideram grupos de vilões poderosos, tramando planos sombrios para destruir o Universo Marvel! Apenas vocês podem detê-los.
            </p>
            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '2rem' }}>Como Vencer</h4>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Os jogadores devem trabalhar em equipe para atacar com sucesso o Super-Vilão <strong>quatro vezes</strong>. Se conseguirem, o Super-Vilão é derrotado de uma vez por todas, e todos os jogadores vencem o jogo em nome das forças do bem!
            </p>
            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '2rem' }}>Como o Super-Vilão Vence</h4>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Diferente de outros jogos, em Legendary o jogo em si luta contra os jogadores! O Super-Vilão tenta realizar o <strong>Cenário (Esquema)</strong> durante toda a partida. Cada carta de Cenário possui uma parte chamada “Vitória do Mal”. Se o Cenário for concluído, o Super-Vilão vence o jogo — e todos os jogadores perdem!
            </p>
          </div>
        )}

        {activeRuleTab === 'setup' && (
          <div className="rule-content animation-fade-in">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users color="var(--primary-color)" />
              Preparação do Jogo
            </h3>
            
            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '1.5rem' }}>Baralhos dos Jogadores</h4>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Dê a cada jogador um baralho pessoal de <strong>12 cartas</strong>, composto por:<br/>
              • 8 Agentes da S.H.I.E.L.D. (Recrutamento)<br/>
              • 4 Soldados da S.H.I.E.L.D. (Ataque)
            </p>

            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '1.5rem' }}>Pilhas do Tabuleiro</h4>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Coloque as seguintes pilhas de cartas ao lado do tabuleiro:<br/>
              • 30 Oficiais da S.H.I.E.L.D.<br/>
              • 30 Ferimentos<br/>
              • 30 Reféns (Virados para baixo)
            </p>

            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '1.5rem' }}>Baralhos (Por Número de Jogadores)</h4>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
              <table style={{ width: '100%', color: 'var(--text-secondary)', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'white' }}>
                    <th style={{ padding: '8px' }}>Jogadores</th>
                    <th style={{ padding: '8px' }}>Grupos de Vilões</th>
                    <th style={{ padding: '8px' }}>Grupos de Capangas</th>
                    <th style={{ padding: '8px' }}>Reféns</th>
                    <th style={{ padding: '8px' }}>Heróis no QG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px' }}>1 (Solo Base)</td>
                    <td style={{ padding: '8px' }}>1</td>
                    <td style={{ padding: '8px' }}>1</td>
                    <td style={{ padding: '8px' }}>1</td>
                    <td style={{ padding: '8px' }}>3</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px' }}>1 (Advanced Solo)</td>
                    <td style={{ padding: '8px' }}>2</td>
                    <td style={{ padding: '8px' }}>1</td>
                    <td style={{ padding: '8px' }}>2</td>
                    <td style={{ padding: '8px' }}>5</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px' }}>2</td>
                    <td style={{ padding: '8px' }}>2</td>
                    <td style={{ padding: '8px' }}>1</td>
                    <td style={{ padding: '8px' }}>2</td>
                    <td style={{ padding: '8px' }}>5</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px' }}>3</td>
                    <td style={{ padding: '8px' }}>3</td>
                    <td style={{ padding: '8px' }}>1</td>
                    <td style={{ padding: '8px' }}>8</td>
                    <td style={{ padding: '8px' }}>5</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px' }}>4</td>
                    <td style={{ padding: '8px' }}>3</td>
                    <td style={{ padding: '8px' }}>2</td>
                    <td style={{ padding: '8px' }}>8</td>
                    <td style={{ padding: '8px' }}>5</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px' }}>5</td>
                    <td style={{ padding: '8px' }}>4</td>
                    <td style={{ padding: '8px' }}>2</td>
                    <td style={{ padding: '8px' }}>12</td>
                    <td style={{ padding: '8px' }}>6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeRuleTab === 'turn' && (
          <div className="rule-content animation-fade-in">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Swords color="var(--primary-color)" />
              O Turno
            </h3>
            
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Cada turno do jogador consiste em três fases principais:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderLeft: '4px solid var(--primary-color)', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.3rem' }}>1. Fase do Vilão</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
                  Revele a carta do topo do <strong>Baralho de Vilões</strong>. O que acontece depende do tipo da carta:
                </p>
                <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '10px 0 0 20px', padding: 0 }}>
                  <li style={{ marginBottom: '8px' }}><strong>Vilão ou Capanga:</strong> Entra no espaço de Esgoto da Cidade. Se já tiver um vilão lá, ele empurra o vilão anterior para frente. Se a Cidade ficar cheia e alguém for empurrado para fora, ocorre uma Fuga (Escape).</li>
                  <li style={{ marginBottom: '8px' }}><strong>Ataque do Mestre (Master Strike):</strong> O Super-Vilão realiza seu ataque (leia a carta do Mastermind) e depois coloque a carta na pilha correspondente.</li>
                  <li style={{ marginBottom: '8px' }}><strong>Reviravolta (Scheme Twist):</strong> O plano avança! Leia a carta de Esquema (Scheme) para ver o que acontece (Torção 1, 2, etc).</li>
                  <li style={{ marginBottom: '8px' }}><strong>Refém (Bystander):</strong> O Refém é capturado pelo vilão que estiver no espaço mais próximo do Baralho de Vilões (Esgotos). Se não houver vilões na Cidade, ele é capturado pelo Super-Vilão (Mastermind).</li>
                  <li style={{ marginBottom: '8px' }}><strong>Efeito Específico (Strike/Trap):</strong> Expansões possuem cartas com comportamentos únicos. Basta seguir o que está escrito.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderLeft: '4px solid var(--primary-color)', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>2. Fase de Ação</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Jogue cartas da sua mão para gerar Pontos de Recrutamento (estrelas) e Poder de Ataque (garras). 
                  Use o recrutamento para comprar novos Heróis do QG. Use o ataque para derrotar Vilões na Cidade ou o Super-Vilão. Você pode realizar ações em qualquer ordem e quantas vezes puder.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderLeft: '4px solid var(--primary-color)', borderRadius: '0 8px 8px 0' }}>
                <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>3. Fase de Descarte</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Descarte todas as cartas que você jogou e todas as cartas que sobraram na sua mão. Compre 6 novas cartas do seu baralho. Se o baralho acabar, embaralhe sua pilha de descarte para formar um novo baralho.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeRuleTab === 'villain' && (
          <div className="rule-content animation-fade-in">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert color="var(--primary-color)" />
              Regras de Vilões
            </h3>
            
            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '1.5rem' }}>Efeito "Golpe" (Strike)</h4>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Quando uma carta de "Ataque do Super-Vilão" (Master Strike) é revelada do Baralho de Vilão, ela faz o Super-Vilão realizar seu efeito especial de Golpe descrito em sua carta. Após resolver o efeito, coloque a carta de Ataque no espaço correspondente no tabuleiro.
            </p>

            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '1.5rem' }}>Reviravolta (Scheme Twist)</h4>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Quando uma "Reviravolta" (Scheme Twist) é revelada, o plano maligno do Esquema avança! Leia a carta de Esquema para ver o que acontece. A carta indicará como resolver as Torções de 1 a N.
            </p>

            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.8rem', marginTop: '1.5rem' }}>Fugas (Escapes)</h4>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Quando um Vilão entra em uma Cidade que já está cheia, o Vilão que estava no último espaço (A Ponte) escapa!<br/><br/>
              • Qualquer Refém capturado por ele é morto (coloque-os na pilha de fuga).<br/>
              • Um Herói do QG que custe 6 ou menos deve ser nocauteado.<br/>
              • Resolva qualquer habilidade de "Fuga" escrita na carta do Vilão.<br/>
              • Todos os jogadores recebem 1 carta de Ferimento se ele escapar com um Refém.
            </p>
          </div>
        )}

        {activeRuleTab === 'pdfs' && (
          <div className="rule-content animation-fade-in">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText color="var(--primary-color)" />
              Acervo de Manuais
            </h3>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Acesse os manuais oficiais em PDF do jogo base e de todas as expansões que você possui. 
              Clique em um livro de regras para visualizá-lo ou baixá-lo no seu dispositivo.
            </p>

            <h4 style={{ color: 'var(--primary-color)', fontSize: '1.3rem', marginBottom: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
              Core Set (Jogo Base)
            </h4>
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginBottom: '3rem' }}>
              {pdfManuals.filter(m => m.type === 'core' && ownedExpansions.includes(m.id)).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>Nenhum Core Set ativado na coleção.</p>
              ) : (
                pdfManuals.filter(m => m.type === 'core' && ownedExpansions.includes(m.id)).map((manual, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSelectedPdfUrl(`${PDF_BASE_URL}/${manual.file}`)}
                    className="glass-panel" 
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', textDecoration: 'none', transition: 'all 0.2s', borderLeft: '4px solid var(--primary-color)', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: '1px solid var(--surface-border)' }}
                  >
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                      <Download size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                      <h5 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>{manual.name}</h5>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Visualizar PDF (Popup)</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <h4 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
              Manuais de Expansões
            </h4>
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {pdfManuals.filter(m => m.type === 'expansion' && ownedExpansions.includes(m.id)).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>Nenhuma expansão ativada na sua coleção.</p>
              ) : (
                pdfManuals.filter(m => m.type === 'expansion' && ownedExpansions.includes(m.id)).map((manual, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSelectedPdfUrl(`${PDF_BASE_URL}/${manual.file}`)}
                    className="glass-panel pdf-card" 
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', textDecoration: 'none', transition: 'all 0.2s', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: '1px solid var(--surface-border)' }}
                  >
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                      <FileText size={24} color="var(--text-secondary)" />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <h5 style={{ color: 'white', margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{manual.name}</h5>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Visualizar PDF (Popup)</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

      {/* Modal / Popup PDF */}
      {selectedPdfUrl && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1200px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--surface-color)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              padding: '15px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--surface-border)',
              backgroundColor: 'rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} color="var(--primary-color)" />
                Visualizador de Manual
              </h3>
              <button 
                onClick={() => setSelectedPdfUrl(null)}
                style={{
                  background: 'transparent', border: 'none', color: 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '5px', borderRadius: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <iframe 
                src={selectedPdfUrl} 
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Manual PDF"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
