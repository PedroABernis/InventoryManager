import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  cidade: string;
  cep: string;
  estado: string;
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    const dados = localStorage.getItem("fornecedores");
    if (dados) {
      setFornecedores(JSON.parse(dados));
    }
  }, []);

  useEffect(() => {
    if (fornecedores.length > 0) {
      localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
    }
  }, [fornecedores]);

  function handleCadastrarFornecedor(e: React.FormEvent) {
    e.preventDefault();
    const novoFornecedor: Fornecedor = {
      id: Date.now(),
      nome,
      cnpj,
      cidade,
      cep,
      estado,
    };
    setFornecedores((prev) => [...prev, novoFornecedor]);
    setNome("");
    setCnpj("");
    setCidade("");
    setCep("");
    setEstado("");
  }

  function handleExcluirFornecedor(id: number) {
    const novosFornecedores = fornecedores.filter(f => f.id !== id);
    setFornecedores(novosFornecedores);
    localStorage.setItem("fornecedores", JSON.stringify(novosFornecedores)); 
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6">Cadastro de Fornecedores</h1>
        <Link
          to="/cadastro"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar
        </Link>
      </div>

      <form
  onSubmit={handleCadastrarFornecedor}
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
    Cadastrar Fornecedor
  </Button>
</form>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {fornecedores.map((fornecedor) => (
    <div key={fornecedor.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h3 className="text-xl font-bold">{fornecedor.nome}</h3>
      <p className="text-gray-600">CNPJ: {fornecedor.cnpj}</p>
      <p className="text-gray-600">Cidade: {fornecedor.cidade}</p>
      <p className="text-gray-600">CEP: {fornecedor.cep}</p>
      <p className="text-gray-600">Estado: {fornecedor.estado}</p>

      <Button
        variant="destructive"
        onClick={() => handleExcluirFornecedor(fornecedor.id)}
        className="mt-auto"
      >
        Excluir
      </Button>
    </div>
  ))}
</div>

    </div>
  );
}
