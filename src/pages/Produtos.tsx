import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  fornecedor: string;
  imagem?: string;
}

interface Fornecedor {
  id: number;
  nome: string;
  contato: string;
  endereco: string;
}

export default function Produtos() {

  const [produtos, setProdutos] = useState<Produto[]>(() => {
    const dadosProdutos = localStorage.getItem("produtos");
    try {
      return dadosProdutos ? JSON.parse(dadosProdutos) : [];
    } catch (e) {
      console.error("Erro ao carregar produtos do localStorage:", e);
      return [];
    }
  });

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState<number>(0);
  const [descricao, setDescricao] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [imagem, setImagem] = useState<string | undefined>(undefined);

  const [editandoProduto, setEditandoProduto] = useState<Produto | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [ordemPreco, setOrdemPreco] = useState<"asc" | "desc">("asc");

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  useEffect(() => {
    const dadosFornecedores = localStorage.getItem("fornecedores");
    if (dadosFornecedores) {
      setFornecedores(JSON.parse(dadosFornecedores));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  const limparFormulario = () => {
    setNome("");
    setPreco(0);
    setDescricao("");
    setFornecedor("");
    setImagem(undefined);
    setEditandoProduto(null); 
  };

  function handleCadastrarProduto(e: React.FormEvent) {
    e.preventDefault();
    if (!fornecedor) {
      alert("Selecione um fornecedor válido.");
      return;
    }

    if (editandoProduto) {
      setProdutos((prevProdutos) =>
        prevProdutos.map((p) =>
          p.id === editandoProduto.id
            ? {
                ...p,
                nome,
                preco,
                descricao,
                fornecedor,
                imagem,
              }
            : p
        )
      );
    } else {
 
      const novoProduto: Produto = {
        id: Date.now(),
        nome,
        preco,
        descricao,
        fornecedor,
        imagem,
      };
      setProdutos((prevProdutos) => [...prevProdutos, novoProduto]);
    }

    limparFormulario(); 
  }

  function handleExcluirProduto(id: number) {
    const atualizados = produtos.filter((produto) => produto.id !== id);
    setProdutos(atualizados);

  }

  function handleEditarProduto(produto: Produto) {
    setEditandoProduto(produto);
    setNome(produto.nome);
    setPreco(produto.preco);
    setDescricao(produto.descricao);
    setFornecedor(produto.fornecedor);
    setImagem(produto.imagem); 
  }

  function handleUploadImagem(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const produtosFiltrados = produtos
    .filter((p) =>  p.nome.toLowerCase().includes(filtroNome.toLowerCase()))
    .filter((p) =>  p.fornecedor.toLowerCase().includes(filtroFornecedor.toLowerCase()))
    .sort((a, b) => (ordemPreco === "asc" ? a.preco - b.preco : b.preco - a.preco));

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6">Cadastro de Produtos</h1>
        <Link
          to="/home"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar
        </Link>
      </div>

      <form onSubmit={handleCadastrarProduto} className="space-y-4 bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div>
            <Label>Preço</Label>
            <Input type="number" value={preco} onChange={(e) => setPreco(Number(e.target.value))} required />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          </div>
          <div>
            <Label>Fornecedor</Label>
            <select
              value={fornecedor}
              onChange={(e) => setFornecedor(e.target.value)}
              required
              className="border rounded p-2 w-full"
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.nome}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Imagem</Label>
            <Input type="file" accept="image/*" onChange={handleUploadImagem} />
            {imagem && (
              <div className="mt-2">
                <img src={imagem} alt="Pré-visualização da imagem" className="h-20 object-cover rounded" />
                <Button variant="ghost" size="sm" onClick={() => setImagem(undefined)} className="text-red-500">Remover Imagem</Button>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          {editandoProduto ? "Atualizar Produto" : "Cadastrar Produto"}
        </Button>
        {editandoProduto && (
          <Button type="button" onClick={limparFormulario} variant="outline" className="w-full mt-2">
            Cancelar Edição
          </Button>
        )}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <Input placeholder="Filtrar por nome" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
        <Input placeholder="Filtrar por fornecedor" value={filtroFornecedor} onChange={(e) => setFiltroFornecedor(e.target.value)} />
        <div className="flex space-x-4 mt-2">
          <Button type="button" onClick={() => setOrdemPreco("asc")}>
            Preço Crescente
          </Button>
          <Button type="button" onClick={() => setOrdemPreco("desc")}>
            Preço Decrescente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtosFiltrados.map((produto) => (
          <div key={produto.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
            {produto.imagem && <img src={produto.imagem} alt="Imagem do Produto" className="h-40 object-cover mb-4 rounded-md" />}
            <h3 className="text-xl font-bold">{produto.nome}</h3>
            <p className="text-gray-600">Preço: R$ {produto.preco.toFixed(2)}</p>
            <p className="text-gray-500">Fornecedor: {produto.fornecedor}</p>
            <p className="text-gray-400 text-sm mt-2">{produto.descricao}</p>

            <div className="flex gap-2 mt-auto pt-4">
              <Button onClick={() => handleEditarProduto(produto)} className="flex-1">
                Editar
              </Button>
              <Button
                onClick={() => handleExcluirProduto(produto.id)}
                variant="destructive"
                className="flex-1"
              >
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}