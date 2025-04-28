import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input"; 
import { Label } from "../components/ui/label"; 
import { Button } from "../components/ui/button";

interface Cliente {
  id: number;
  nome: string;
  contato: string;
  endereco: string;
  cpfCnpj: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [novoCliente, setNovoCliente] = useState<Cliente>({
    id: Date.now(),
    nome: "",
    contato: "",
    endereco: "",
    cpfCnpj: "",
  });

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCpfCnpj, setFiltroCpfCnpj] = useState("");

  useEffect(() => {
    const clientesSalvos = localStorage.getItem("clientes");
    if (clientesSalvos) {
      setClientes(JSON.parse(clientesSalvos));
    }
  }, []);

  useEffect(() => {
    if (clientes.length > 0) {
      localStorage.setItem("clientes", JSON.stringify(clientes));
    }
  }, [clientes]);

  const adicionarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    const novo = { ...novoCliente, id: Date.now() };
    setClientes((prevClientes) => [...prevClientes, novo]);
    setNovoCliente({ id: Date.now(), nome: "", contato: "", endereco: "", cpfCnpj: "" });
  };

  const excluirCliente = (id: number) => {
    const atualizado = clientes.filter(cliente => cliente.id !== id);
    setClientes(atualizado);
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
    cliente.cpfCnpj.includes(filtroCpfCnpj)
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
        <Link
          to="/cadastro"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Voltar
        </Link>
      </div>

      <form onSubmit={adicionarCliente} className="space-y-6 bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={novoCliente.nome}
              onChange={e => setNovoCliente({ ...novoCliente, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Contato</Label>
            <Input
              value={novoCliente.contato}
              onChange={e => setNovoCliente({ ...novoCliente, contato: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Endereço</Label>
            <Input
              value={novoCliente.endereco}
              onChange={e => setNovoCliente({ ...novoCliente, endereco: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>CPF/CNPJ</Label>
            <Input
              value={novoCliente.cpfCnpj}
              onChange={e => setNovoCliente({ ...novoCliente, cpfCnpj: e.target.value })}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Adicionar Cliente
        </Button>
      </form>

      <div className="flex gap-4 mb-4">
        <div className="w-full">
          <Label>Filtrar por Nome</Label>
          <Input
            value={filtroNome}
            onChange={e => setFiltroNome(e.target.value)}
            required={false}
          />
        </div>
        <div className="w-full">
          <Label>Filtrar por CPF/CNPJ</Label>
          <Input
            value={filtroCpfCnpj}
            onChange={e => setFiltroCpfCnpj(e.target.value)}
            required={false}
          />
        </div>
      </div>

      <ul className="space-y-4">
        {clientesFiltrados.map(cliente => (
          <li key={cliente.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-bold">{cliente.nome}</h2>
              <p>Contato: {cliente.contato}</p>
              <p>Endereço: {cliente.endereco}</p>
              <p>CPF/CNPJ: {cliente.cpfCnpj}</p>
            </div>
            <Button
              onClick={() => excluirCliente(cliente.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Excluir
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
