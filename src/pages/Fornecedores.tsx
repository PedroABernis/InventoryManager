import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card"; 
interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  cidade: string;
  cep: string;
  estado: string;
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => {
    const dados = localStorage.getItem("fornecedores");
    try {
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error("Erro ao carregar fornecedores do localStorage:", e);
      return [];
    }
  });

  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");

  const [editandoFornecedor, setEditandoFornecedor] = useState<Fornecedor | null>(null);

  useEffect(() => {
    localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
  }, [fornecedores]);

  const limparFormulario = () => {
    setNome("");
    setCnpj("");
    setCidade("");
    setCep("");
    setEstado("");
    setEditandoFornecedor(null);
  };

  function handleSalvarFornecedor(e: React.FormEvent) {
    e.preventDefault();

    if (editandoFornecedor) {
      setFornecedores((prev) =>
        prev.map((f) =>
          f.id === editandoFornecedor.id
            ? { ...f, nome, cnpj, cidade, cep, estado }
            : f
        )
      );
    } else {
      const novoFornecedor: Fornecedor = {
        id: Date.now(),
        nome,
        cnpj,
        cidade,
        cep,
        estado,
      };
      setFornecedores((prev) => [...prev, novoFornecedor]);
    }

    limparFormulario();
  }

  function handleExcluirFornecedor(id: number) {
    const novosFornecedores = fornecedores.filter(f => f.id !== id);
    setFornecedores(novosFornecedores);
  }

  function handleEditarFornecedor(fornecedor: Fornecedor) {
    setEditandoFornecedor(fornecedor);
    setNome(fornecedor.nome);
    setCnpj(fornecedor.cnpj);
    setCidade(fornecedor.cidade);
    setCep(fornecedor.cep);
    setEstado(fornecedor.estado);
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6">Cadastro de Fornecedores</h1>
        <Link
          to="/home"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar
        </Link>
      </div>

      <form
        onSubmit={handleSalvarFornecedor}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div>
            <Label>CNPJ</Label>
            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
          </div>
          <div>
            <Label>Cidade</Label>
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} required />
          </div>
          <div>
            <Label>CEP</Label>
            <Input value={cep} onChange={(e) => setCep(e.target.value)} required />
          </div>
          <div>
            <Label>Estado</Label>
            <Input value={estado} onChange={(e) => setEstado(e.target.value)} required />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {editandoFornecedor ? "Atualizar Fornecedor" : "Cadastrar Fornecedor"}
        </Button>
        {editandoFornecedor && (
          <Button
            type="button"
            onClick={limparFormulario}
            variant="outline"
            className="w-full mt-2"
          >
            Cancelar Edição
          </Button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fornecedores.map((fornecedor) => (
          <Card key={fornecedor.id} className="p-4 space-y-2 flex flex-col justify-between"> 
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{fornecedor.nome}</h3>
              <p className="text-gray-600">CNPJ: {fornecedor.cnpj}</p>
              <p className="text-gray-600">Cidade: {fornecedor.cidade}</p>
              <p className="text-gray-600">CEP: {fornecedor.cep}</p>
              <p className="text-gray-600">Estado: {fornecedor.estado}</p>
            </div>

            
            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200"> 
              <Button onClick={() => handleEditarFornecedor(fornecedor)} className="flex-1">
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleExcluirFornecedor(fornecedor.id)}
                className="flex-1"
              >
                Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}