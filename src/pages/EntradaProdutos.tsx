import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

interface Produto {
  id: number;
  nome: string;
  estoque: number;
  custo: number;
}

interface Fornecedor {
  id: number;
  nome: string;
}

interface EntradaProduto {
  produtoNome: string;
  quantidade: number;
  valorTotal: number;
}

interface Transacao {
  id: string;
  produtoId: number;
  fornecedorId: number;
  quantidade: number;
  valorTotal: number;
  data: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getProdutos(): Produto[] {
  return JSON.parse(localStorage.getItem("produtos") || "[]");
}

function saveProdutos(produtos: Produto[]) {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function getFornecedores(): Fornecedor[] {
  return JSON.parse(localStorage.getItem("fornecedores") || "[]");
}

function getTransacoes(): Transacao[] {
  return JSON.parse(localStorage.getItem("transacoes") || "[]");
}

function saveTransacoes(transacoes: Transacao[]) {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

export default function EntradaEstoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [fornecedorInput, setFornecedorInput] = useState("");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [showFornecedoresSugestoes, setShowFornecedoresSugestoes] = useState(false);

  const [produtoInput, setProdutoInput] = useState("");
  const [showProdutosSugestoes, setShowProdutosSugestoes] = useState(false);

  const [listaEntradaProdutos, setListaEntradaProdutos] = useState<EntradaProduto[]>([]);

  const [quantidadeInput, setQuantidadeInput] = useState("");
  const [valorTotalInput, setValorTotalInput] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [ultimasTransacoesIds, setUltimasTransacoesIds] = useState<string[]>([]);

  useEffect(() => {
    setProdutos(getProdutos());
    setFornecedores(getFornecedores());
  }, []);

  const fornecedoresSugeridos = fornecedores.filter(f =>
    f.nome.toLowerCase().includes(fornecedorInput.toLowerCase())
  );

  const produtosSugeridos = produtos.filter(p =>
    p.nome.toLowerCase().includes(produtoInput.toLowerCase())
  );

  const selecionarFornecedor = (nome: string) => {
    setFornecedorInput(nome);
    const f = fornecedores.find(f => f.nome === nome) || null;
    setFornecedorSelecionado(f);
    setShowFornecedoresSugestoes(false);
  };

  const adicionarProdutoNaLista = () => {
    if (!produtoInput.trim()) {
      alert("Digite o nome do produto.");
      return;
    }
    if (!quantidadeInput || parseInt(quantidadeInput) <= 0) {
      alert("Quantidade deve ser maior que zero.");
      return;
    }
    if (!valorTotalInput || parseFloat(valorTotalInput) <= 0) {
      alert("Valor total deve ser maior que zero.");
      return;
    }

    setListaEntradaProdutos(prev => [
      ...prev,
      {
        produtoNome: produtoInput.trim(),
        quantidade: parseInt(quantidadeInput),
        valorTotal: parseFloat(valorTotalInput),
      }
    ]);

    setProdutoInput("");
    setQuantidadeInput("");
    setValorTotalInput("");
    setShowProdutosSugestoes(false);
  };

  const registrarEntradas = () => {
    if (!fornecedorSelecionado) {
      alert("Selecione um fornecedor válido.");
      return;
    }
    if (listaEntradaProdutos.length === 0) {
      alert("Adicione pelo menos um produto à lista.");
      return;
    }

    let prods = [...produtos];
    let transacoes = getTransacoes();

    const novosIds: string[] = [];

    listaEntradaProdutos.forEach(entrada => {
      let produto = prods.find(p => p.nome.toLowerCase() === entrada.produtoNome.toLowerCase());
      if (!produto) {
        produto = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          nome: entrada.produtoNome,
          estoque: 0,
          custo: 0,
        };
        prods.push(produto);
      }
      produto.estoque += entrada.quantidade;
      produto.custo = entrada.valorTotal / entrada.quantidade;

      const novaTransacaoId = generateId();

      transacoes.push({
        id: novaTransacaoId,
        produtoId: produto.id,
        fornecedorId: fornecedorSelecionado.id,
        quantidade: entrada.quantidade,
        valorTotal: entrada.valorTotal,
        data: new Date().toISOString(),
      });

      novosIds.push(novaTransacaoId);
    });

    saveProdutos(prods);
    saveTransacoes(transacoes);
    setProdutos(prods);
    setListaEntradaProdutos([]);
    setMensagem(`Documento gravado com sucesso!`);
    setUltimasTransacoesIds(novosIds);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Card className="w-full">
        <CardContent className="space-y-4 p-6">
          {/* Cabeçalho flexível: título à esquerda e botão à direita */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Entrada de Mercadoria</h2>
            <Link
              to="/home"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Voltar
            </Link>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              value={fornecedorInput}
              onChange={e => {
                setFornecedorInput(e.target.value);
                setFornecedorSelecionado(null);
                setShowFornecedoresSugestoes(true);
              }}
              placeholder="Digite o nome do fornecedor"
              autoComplete="off"
            />
            {showFornecedoresSugestoes && fornecedorInput && fornecedoresSugeridos.length > 0 && (
              <ul className="absolute bg-white border w-full max-h-32 overflow-auto z-10 rounded">
                {fornecedoresSugeridos.map(f => (
                  <li
                    key={f.id}
                    className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                    onClick={() => selecionarFornecedor(f.nome)}
                  >
                    {f.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="produto">Produto</Label>
            <Input
              id="produto"
              value={produtoInput}
              onChange={e => {
                setProdutoInput(e.target.value);
                setShowProdutosSugestoes(true);
              }}
              placeholder="Digite o nome do produto"
              autoComplete="off"
            />
            {showProdutosSugestoes && produtoInput && produtosSugeridos.length > 0 && (
              <ul className="absolute bg-white border w-full max-h-32 overflow-auto z-10 rounded">
                {produtosSugeridos.map(p => (
                  <li
                    key={p.id}
                    className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                    onClick={() => {
                      setProdutoInput(p.nome);
                      setShowProdutosSugestoes(false);
                    }}
                  >
                    {p.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              min={1}
              value={quantidadeInput}
              onChange={e => setQuantidadeInput(e.target.value)}
              placeholder="Quantidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorTotal">Valor Total Pago (R$)</Label>
            <Input
              id="valorTotal"
              type="number"
              min={0.01}
              step="0.01"
              value={valorTotalInput}
              onChange={e => setValorTotalInput(e.target.value)}
              placeholder="Valor total pago"
            />
          </div>

          <Button className="w-full" onClick={adicionarProdutoNaLista}>
            Adicionar Produto à Lista
          </Button>

          {listaEntradaProdutos.length > 0 && (
            <div className="mt-4 border rounded p-3 max-h-48 overflow-auto">
              <h3 className="font-semibold mb-2">Lista de Produtos para Entrada</h3>
              <ul>
                {listaEntradaProdutos.map((p, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{p.produtoNome}</span>
                    <span>Qtd: {p.quantidade}</span>
                    <span>R$ {p.valorTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button className="w-full mt-4" onClick={registrarEntradas}>
            Registrar Entrada
          </Button>

          {mensagem && (
            <p className="mt-4 text-green-700 font-semibold">{mensagem}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
