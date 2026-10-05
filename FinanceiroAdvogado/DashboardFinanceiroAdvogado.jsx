import React from "react";
import css from "./DashboardFinanceiroAdvogado.module.css";

function DashboardFinanceiroAdvogado() {

    const receitaRecebida = 18500;
    const receitaAReceber = 7200;
    const despesas = 8300;

    const saldo = receitaRecebida - despesas;

    const totalReceitas = receitaRecebida + receitaAReceber;

    const percentualRecebido =
        totalReceitas > 0
            ? (receitaRecebida / totalReceitas) * 100
            : 0;

    let situacao;
    let classeSituacao;

    if (saldo > 0 && percentualRecebido >= 70) {
        situacao = "Boa";
        classeSituacao = css.situacaoBoa;
    } else if (saldo >= 0) {
        situacao = "Atenção";
        classeSituacao = css.situacaoAtencao;
    } else {
        situacao = "Crítica";
        classeSituacao = css.situacaoCritica;
    }

    const maiorValor = Math.max(
        receitaRecebida,
        receitaAReceber,
        despesas,
        1
    );

    const alturaRecebida =
        (receitaRecebida / maiorValor) * 100;

    const alturaAReceber =
        (receitaAReceber / maiorValor) * 100;

    const alturaDespesas =
        (despesas / maiorValor) * 100;

    function dinheiro(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    return (
        <div className={css.pagina}>

            <main className={css.conteudo}>

                <header className={css.cabecalho}>
                    <p className={css.subtitulo}>
                        FINANCEIRO DO ESCRITÓRIO
                    </p>

                    <h1>
                        Saúde financeira
                    </h1>

                    <p className={css.descricao}>
                        Acompanhe os principais indicadores financeiros
                        do seu escritório.
                    </p>
                </header>


                <section className={css.indicadores}>

                    <div className={css.card}>
                        <div className={`${css.icone} ${css.iconeReceita}`}>
                            R$
                        </div>

                        <div>
                            <p>Receita recebida</p>
                            <strong>
                                {dinheiro(receitaRecebida)}
                            </strong>
                        </div>
                    </div>


                    <div className={css.card}>
                        <div className={`${css.icone} ${css.iconeReceber}`}>
                            +
                        </div>

                        <div>
                            <p>Receita a receber</p>
                            <strong>
                                {dinheiro(receitaAReceber)}
                            </strong>
                        </div>
                    </div>


                    <div className={css.card}>
                        <div className={`${css.icone} ${css.iconeDespesa}`}>
                            -
                        </div>

                        <div>
                            <p>Despesas</p>
                            <strong>
                                {dinheiro(despesas)}
                            </strong>
                        </div>
                    </div>


                    <div className={css.card}>
                        <div className={`${css.icone} ${css.iconeSaldo}`}>
                            =
                        </div>

                        <div>
                            <p>Saldo</p>
                            <strong>
                                {dinheiro(saldo)}
                            </strong>
                        </div>
                    </div>

                </section>


                <section className={css.bloco}>

                    <div className={css.tituloBloco}>
                        <div>
                            <h2>
                                Visão financeira
                            </h2>

                            <p>
                                Comparativo entre receitas e despesas
                            </p>
                        </div>
                    </div>


                    <div className={css.grafico}>

                        <div className={css.coluna}>

                            <span className={css.valor}>
                                {dinheiro(receitaRecebida)}
                            </span>

                            <div className={css.areaBarra}>
                                <div
                                    className={`${css.barra} ${css.barraRecebida}`}
                                    style={{
                                        height: `${alturaRecebida}%`
                                    }}
                                />
                            </div>

                            <span className={css.label}>
                                Recebido
                            </span>

                        </div>


                        <div className={css.coluna}>

                            <span className={css.valor}>
                                {dinheiro(receitaAReceber)}
                            </span>

                            <div className={css.areaBarra}>
                                <div
                                    className={`${css.barra} ${css.barraAReceber}`}
                                    style={{
                                        height: `${alturaAReceber}%`
                                    }}
                                />
                            </div>

                            <span className={css.label}>
                                A receber
                            </span>

                        </div>


                        <div className={css.coluna}>

                            <span className={css.valor}>
                                {dinheiro(despesas)}
                            </span>

                            <div className={css.areaBarra}>
                                <div
                                    className={`${css.barra} ${css.barraDespesas}`}
                                    style={{
                                        height: `${alturaDespesas}%`
                                    }}
                                />
                            </div>

                            <span className={css.label}>
                                Despesas
                            </span>

                        </div>

                    </div>

                </section>


                <section className={css.blocoSaude}>

                    <div className={css.saudeTexto}>

                        <p className={css.subtitulo}>
                            INDICADOR DA SAÚDE FINANCEIRA
                        </p>

                        <h2 className={classeSituacao}>
                            {situacao}
                        </h2>

                        <p>
                            {situacao === "Boa" &&
                                "O escritório apresenta saldo positivo e uma boa proporção de receitas recebidas."
                            }

                            {situacao === "Atenção" &&
                                "É importante acompanhar as receitas a receber e as despesas do escritório."
                            }

                            {situacao === "Crítica" &&
                                "As despesas estão comprometendo o resultado financeiro do escritório."
                            }
                        </p>

                    </div>


                    <div className={`${css.percentual} ${classeSituacao}`}>
                        {Math.round(percentualRecebido)}%
                    </div>

                </section>


                <section className={css.bloco}>

                    <div className={css.tituloBloco}>
                        <div>
                            <h2>
                                Situações da saúde financeira
                            </h2>

                            <p>
                                Entenda o significado de cada indicador.
                            </p>
                        </div>
                    </div>


                    <div className={css.situacoes}>

                        <div className={css.situacaoCard}>

                            <span
                                className={`${css.ponto} ${css.pontoVerde}`}
                            />

                            <div>
                                <h3>Boa</h3>

                                <p>
                                    Saldo positivo e pelo menos 70%
                                    das receitas previstas já recebidas.
                                </p>
                            </div>

                        </div>


                        <div className={css.situacaoCard}>

                            <span
                                className={`${css.ponto} ${css.pontoAmarelo}`}
                            />

                            <div>
                                <h3>Atenção</h3>

                                <p>
                                    O escritório possui saldo positivo,
                                    mas precisa acompanhar os valores.
                                </p>
                            </div>

                        </div>


                        <div className={css.situacaoCard}>

                            <span
                                className={`${css.ponto} ${css.pontoVermelho}`}
                            />

                            <div>
                                <h3>Crítica</h3>

                                <p>
                                    O resultado financeiro está negativo
                                    e exige atenção imediata.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>


                <section className={css.bloco}>

                    <div className={css.tituloBloco}>
                        <h2>
                            Resumo financeiro
                        </h2>
                    </div>


                    <div className={css.resumo}>

                        <div className={css.linha}>
                            <span>
                                Total de receitas previstas
                            </span>

                            <strong>
                                {dinheiro(totalReceitas)}
                            </strong>
                        </div>


                        <div className={css.linha}>
                            <span>
                                Receita recebida
                            </span>

                            <strong>
                                {dinheiro(receitaRecebida)}
                            </strong>
                        </div>


                        <div className={css.linha}>
                            <span>
                                Receita a receber
                            </span>

                            <strong>
                                {dinheiro(receitaAReceber)}
                            </strong>
                        </div>


                        <div className={css.linha}>
                            <span>
                                Despesas
                            </span>

                            <strong>
                                {dinheiro(despesas)}
                            </strong>
                        </div>


                        <div className={css.linhaFinal}>
                            <span>
                                Saldo atual
                            </span>

                            <strong>
                                {dinheiro(saldo)}
                            </strong>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default DashboardFinanceiroAdvogado;