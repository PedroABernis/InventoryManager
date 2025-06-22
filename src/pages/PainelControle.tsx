import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  custo: number;
  estoque: number;
  ativo: boolean;
}

interface Transacao {
  id: string;
  produtoId: number;
  clienteId: number;
  quantidade: number;
  valorTotal: number;
  data: string;
}

export default function PainelProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);
  const [filtroNome, setFiltroNome] = useState("");
  const [abaAtiva, setAbaAtiva] = useState<"produtos" | "historico">("produtos");

  useEffect(() => {
    const produtosLS = localStorage.getItem("produtos");
    if (produtosLS) {
      setProdutos(JSON.parse(produtosLS));
    }

    const transacoesLS = localStorage.getItem("transacoes");
    if (transacoesLS) {
      setTransacoes(JSON.parse(transacoesLS));
    }
  }, []);

  const alternarStatus = (id: number) => {
    const atualizados = produtos.map((p) =>
      p.id === id ? { ...p, ativo: !p.ativo } : p
    );
    setProdutos(atualizados);
    localStorage.setItem("produtos", JSON.stringify(atualizados));
  };

  const calcularLucro = (preco: number, custo: number): string => {
    if (!custo || custo <= 0) return "N/A";
    const lucro = ((preco - custo) / custo) * 100;
    return `${lucro.toFixed(1)}%`;
  };

  const historico = transacoes
    .filter((t) => t.produtoId === produtoSelecionado)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .map((t, index, arr) => {
      const anteriores = arr.slice(index + 1);
      const estoqueAnterior = anteriores.reduce((acc, trans) => acc + trans.quantidade, 0);
      const estoqueAtual = estoqueAnterior + t.quantidade;

      return {
        id: t.id,
        data: new Date(t.data).toLocaleString(),
        tipo: t.quantidade < 0 ? "S" : "E",
        descricao:
          t.quantidade < 0 ? "Venda de mercadoria" : "Compra de mercadoria para revenda",
        quantidade: Math.abs(t.quantidade),
        estoqueAnterior,
        estoqueAtual,
      };
    });

  return (
    <section className="mt-10 mx-auto max-w-7xl w-full px-4">

      {/* Abas de Navegação */}
      <div className="flex gap-4 border-b border-gray-300 mb-6">
        <button
          onClick={() => setAbaAtiva("produtos")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            abaAtiva === "produtos"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-black"
          }`}
        >
          Produtos Cadastrados
        </button>
        <button
          onClick={() => setAbaAtiva("historico")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            abaAtiva === "historico"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-black"
          }`}
        >
          Histórico de Produtos
        </button>
      </div>

      {/* Aba Produtos */}
      {abaAtiva === "produtos" && (
        <>
          <input
            type="text"
            placeholder="Buscar por nome do produto..."
            className="mb-4 w-full md:w-1/2 border border-gray-300 rounded px-4 py-2"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />

          {produtos.length === 0 ? (
            <p className="text-gray-500">Nenhum produto cadastrado.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md mb-10">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Preço</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Custo</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lucro</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estoque</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produtos
                    .filter((p) => p.nome.toLowerCase().includes(filtroNome.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-5 py-2 text-sm">{p.nome}</td>
                        <td className="px-5 py-2 text-sm">R$ {p.preco.toFixed(2)}</td>
                        <td className="px-5 py-2 text-sm">R$ {p.custo?.toFixed(2) ?? "N/A"}</td>
                        <td className="px-5 py-2 text-sm">{calcularLucro(p.preco, p.custo)}</td>
                        <td className="px-5 py-2 text-sm">{p.estoque}</td>
                        <td className="px-5 py-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              p.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {p.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-5 py-2 text-sm">
                          <Button
                            size="sm"
                            onClick={() => alternarStatus(p.id)}
                            className={`text-white px-3 py-1 rounded ${
                              p.ativo ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {p.ativo ? "Inativar" : "Ativar"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Aba Histórico */}
      {abaAtiva === "historico" && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Histórico do Produto</h3>

          <select
            className="border rounded p-2 mb-4 w-full md:w-1/2"
            value={produtoSelecionado ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setProdutoSelecionado(value ? parseInt(value) : null);
            }}
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          {produtoSelecionado !== null && (
            historico.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Data</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Tipo</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Descrição</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Quantidade</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Estoque Anterior</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Estoque Atual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historico.map((h, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{h.data}</td>
                        <td className="px-4 py-2 text-sm font-bold text-center">{h.tipo}</td>
                        <td className="px-4 py-2 text-sm">{h.descricao}</td>
                        <td className="px-4 py-2 text-sm">{h.quantidade}</td>
                        <td className="px-4 py-2 text-sm">{h.estoqueAnterior}</td>
                        <td className="px-4 py-2 text-sm">{h.estoqueAtual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma transação encontrada para este produto.</p>
            )
          )}
        </div>
      )}
    </section>
  );
}
