import React, { useEffect, useState } from 'react';
import css from './FinanceiroAdvogado.module.css';
import Header from '../Header/Header.jsx';
import MenuLateralAdvogado from '../MenuLateralAdvogado/MenuLateralAdvogado.jsx';
import Footer from '../Footer/Footer.jsx';
import { useNavigate } from 'react-router-dom';

const ALTURA_GRAFICO = 180;

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(valor) || 0);
}

export default function FinanceiroAdvogado({ api }) {
    const navigate = useNavigate();
    const API_URL = api || 'http://10.92.11.22:5000';

    const [menuColapsado, setMenuColapsado] = useState(
        () => localStorage.getItem('menu_colapsado') === 'true'
    );
    const [filtroPeriodo, setFiltroPeriodo] = useState('mes');
    const [dados, setDados] = useState([]);
    const [totais, setTotais] = useState({ recebido: 0, aReceber: 0 });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    // Sincroniza o estado do menu lateral
    useEffect(() => {
        function aplicarEstadoMenu(e) {
            setMenuColapsado(Boolean(e?.detail?.colapsado));
        }

        window.addEventListener('menu-lateral-toggle', aplicarEstadoMenu);
        return () => window.removeEventListener('menu-lateral-toggle', aplicarEstadoMenu);
    }, []);

    // Busca os rendimentos sempre que o período mudar
    useEffect(() => {
        const tipo = localStorage.getItem('tipo');
        const token = localStorage.getItem('token');

        if (!tipo || !token) {
            navigate('/login');
            return;
        }

        const controller = new AbortController();

        function limparSessaoERedirecionar() {
            localStorage.removeItem('nome');
            localStorage.removeItem('tipo');
            localStorage.removeItem('token');
            localStorage.removeItem('id_usuario');
            navigate('/login');
        }

        async function buscarRendimentos() {
            setCarregando(true);
            setErro('');

            try {
                const response = await fetch(
                    `${API_URL}/dashboard/rendimentos?periodo=${encodeURIComponent(filtroPeriodo)}`,
                    {
                        method: 'GET',
                        headers: { 'X-Access-Token': token },
                        signal: controller.signal
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setDados(Array.isArray(data.dados) ? data.dados : []);
                    setTotais({
                        recebido: Number(data.totais?.recebido) || 0,
                        aReceber: Number(data.totais?.a_receber) || 0
                    });
                } else if (response.status === 401) {
                    limparSessaoERedirecionar();
                } else {
                    setDados([]);
                    setTotais({ recebido: 0, aReceber: 0 });
                    setErro('Não foi possível carregar os dados financeiros.');
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                console.error('Erro ao buscar rendimentos:', error);
                setDados([]);
                setTotais({ recebido: 0, aReceber: 0 });
                setErro('Erro de conexão com o servidor.');
            } finally {
                if (!controller.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        buscarRendimentos();

        return () => controller.abort();
    }, [API_URL, navigate, filtroPeriodo]);

    // ---------- Indicadores ----------
    const recebido = Number(totais.recebido) || 0;
    const aReceber = Number(totais.aReceber) || 0;
    const totalPrevisto = recebido + aReceber;

    const taxaRecebimento = totalPrevisto > 0 ? (recebido / totalPrevisto) * 100 : 0;
    const taxaPendencia = totalPrevisto > 0 ? (aReceber / totalPrevisto) * 100 : 0;

    const periodosComDados = dados.length;
    const mediaPorPeriodo = periodosComDados > 0 ? recebido / periodosComDados : 0;

    let melhorPeriodo = null;
    dados.forEach(item => {
        const valor = Number(item.recebido) || 0;
        if (!melhorPeriodo || valor > melhorPeriodo.valor) {
            melhorPeriodo = { label: item.label, valor };
        }
    });

    function classificarSaude(taxa) {
        if (totalPrevisto === 0) {
            return { texto: 'Sem dados', classe: css.saudeNeutra };
        }
        if (taxa >= 80) {
            return { texto: 'Saudável', classe: css.saudeBoa };
        }
        if (taxa >= 50) {
            return { texto: 'Atenção', classe: css.saudeAtencao };
        }
        return { texto: 'Crítica', classe: css.saudeCritica };
    }

    const saude = classificarSaude(taxaRecebimento);

    const maxValor = Math.max(
        ...dados.map(item =>
            Math.max(Number(item.recebido) || 0, Number(item.a_receber) || 0)
        ),
        1
    );

    const semDados = !carregando && dados.length === 0;

    return (
        <div className={css.paginaCompleta}>
            <Header api={API_URL} />

            <div className={css.layoutPagina}>
                <div className={`${css.menuLateralContainer} ${menuColapsado ? css.menuLateralColapsado : ''}`}>
                    <MenuLateralAdvogado api={API_URL} />
                </div>

                <main className={css.conteudoPrincipal}>
                    <button
                        type="button"
                        className={css.botaoVoltar}
                        onClick={() => navigate('/dashboard_advogado')}
                        name="btn-voltar-dashboard"
                    >
                         Voltar ao painel
                    </button>

                    <div className={css.topoPagina}>
                        <div>
                            <h1 className={css.tituloPagina}>Saúde financeira do escritório</h1>
                            <p className={css.subtituloPagina}>
                                Acompanhe os indicadores de recebimento e os valores pendentes.
                            </p>
                        </div>

                        <select
                            className={css.selectFiltro}
                            value={filtroPeriodo}
                            onChange={e => setFiltroPeriodo(e.target.value)}
                            aria-label="Período dos indicadores"
                        >
                            <option value="mes">Este mês</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>

                    {erro && <div className={css.mensagemErro}>{erro}</div>}

                    {/* Cards de indicadores */}
                    <section className={css.gridIndicadores} aria-label="Indicadores financeiros">
                        <div className={css.cardIndicador}>
                            <span className={css.labelIndicador}>Total recebido</span>
                            <span className={`${css.valorIndicador} ${css.corVerde}`}>
                                {carregando ? '...' : formatarMoeda(recebido)}
                            </span>
                        </div>

                        <div className={css.cardIndicador}>
                            <span className={css.labelIndicador}>A receber</span>
                            <span className={`${css.valorIndicador} ${css.corLaranja}`}>
                                {carregando ? '...' : formatarMoeda(aReceber)}
                            </span>
                        </div>

                        <div className={css.cardIndicador}>
                            <span className={css.labelIndicador}>Total previsto</span>
                            <span className={css.valorIndicador}>
                                {carregando ? '...' : formatarMoeda(totalPrevisto)}
                            </span>
                        </div>

                        <div className={css.cardIndicador}>
                            <span className={css.labelIndicador}>Taxa de recebimento</span>
                            <span className={css.valorIndicador}>
                                {carregando ? '...' : `${taxaRecebimento.toFixed(1)}%`}
                            </span>
                            {!carregando && (
                                <span className={`${css.selo} ${saude.classe}`}>{saude.texto}</span>
                            )}
                        </div>
                    </section>

                    {/* Barra de progresso recebido x a receber */}
                    <section className={css.cardSecao}>
                        <h2 className={css.tituloSecao}>Recebido x pendente</h2>

                        <div
                            className={css.barraProgresso}
                            role="img"
                            aria-label={`${taxaRecebimento.toFixed(1)}% recebido`}
                        >
                            <div
                                className={css.progressoRecebido}
                                style={{ width: `${taxaRecebimento}%` }}
                            />
                            <div
                                className={css.progressoPendente}
                                style={{ width: `${taxaPendencia}%` }}
                            />
                        </div>

                        <div className={css.legendaProgresso}>
                            <span>
                                <i className={css.pontoVerde} /> Recebido ({taxaRecebimento.toFixed(1)}%)
                            </span>
                            <span>
                                <i className={css.pontoLaranja} /> A receber ({taxaPendencia.toFixed(1)}%)
                            </span>
                        </div>
                    </section>

                    <div className={css.gradeDupla}>
                        {/* Gráfico */}
                        <section className={css.cardSecao}>
                            <h2 className={css.tituloSecao}>Evolução dos rendimentos</h2>

                            {carregando ? (
                                <p className={css.textoVazio}>Carregando...</p>
                            ) : semDados ? (
                                <p className={css.textoVazio}>Nenhum dado disponível para o período.</p>
                            ) : (
                                <>
                                    <div className={css.graficoLegenda}>
                                        <span className={css.legendaRecebido}>■ Recebido</span>
                                        <span className={css.legendaAReceber}>■ A Receber</span>
                                    </div>

                                    <div className={css.graficoBarras}>
                                        {dados.map((item, index) => {
                                            const r = Number(item.recebido) || 0;
                                            const a = Number(item.a_receber) || 0;

                                            return (
                                                <div key={item.label ?? index} className={css.barraGrupo}>
                                                    <div className={css.barras}>
                                                        <div
                                                            className={css.barraRecebido}
                                                            style={{ height: `${(r / maxValor) * ALTURA_GRAFICO}px` }}
                                                            title={formatarMoeda(r)}
                                                        />
                                                        <div
                                                            className={css.barraAReceber}
                                                            style={{ height: `${(a / maxValor) * ALTURA_GRAFICO}px` }}
                                                            title={formatarMoeda(a)}
                                                        />
                                                    </div>
                                                    <span className={css.barraLabel}>{item.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </section>

                        {/* Resumo */}
                        <section className={css.cardSecao}>
                            <h2 className={css.tituloSecao}>Resumo do período</h2>

                            <ul className={css.listaResumo}>
                                <li>
                                    <span>Média recebida por período</span>
                                    <strong>{formatarMoeda(mediaPorPeriodo)}</strong>
                                </li>
                                <li>
                                    <span>Melhor período</span>
                                    <strong>
                                        {melhorPeriodo
                                            ? `${melhorPeriodo.label} (${formatarMoeda(melhorPeriodo.valor)})`
                                            : '—'}
                                    </strong>
                                </li>
                                <li>
                                    <span>Percentual pendente</span>
                                    <strong>{taxaPendencia.toFixed(1)}%</strong>
                                </li>
                                <li>
                                    <span>Situação geral</span>
                                    <strong>{saude.texto}</strong>
                                </li>
                            </ul>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}