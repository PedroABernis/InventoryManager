import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card"; // Importe o componente Card

interface Cliente {
  id: number;
  nome: string;
  contato: string;
  endereco: string;
  cpfCnpj: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const clientesSalvos = localStorage.getItem("clientes");
    try {
      return clientesSalvos ? JSON.parse(clientesSalvos) : [];
    } catch (e) {
      console.error("Erro ao carregar clientes do localStorage:", e);
      return []; // Em caso de erro, retorna um array vazio
    }
  });

  const [formCliente, setFormCliente] = useState<Omit<Cliente, "id">>({
    nome: "",
    contato: "",
    endereco: "",
    cpfCnpj: "",
  });

  const [editandoCliente, setEditandoCliente] = useState<Cliente | null>(null);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCpfCnpj, setFiltroCpfCnpj] = useState("");

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  const limparFormulario = () => {
    setFormCliente({
      nome: "",
      contato: "",
      endereco: "",
      cpfCnpj: "",
    });
    setEditandoCliente(null);
  };

  const handleSalvarCliente = (e: React.FormEvent) => {
    e.preventDefault();

    if (editandoCliente) {
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === editandoCliente.id
            ? { ...cliente, ...formCliente }
            : cliente
        )
      );
    } else {
      const novo: Cliente = {
        ...formCliente,
        id: Date.now(),
      };
      setClientes((prevClientes) => [...prevClientes, novo]);
    }

    limparFormulario();
  };

  const excluirCliente = (id: number) => {
    const atualizado = clientes.filter((cliente) => cliente.id !== id);
    setClientes(atualizado);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setEditandoCliente(cliente);
    setFormCliente({
      nome: cliente.nome,
      contato: cliente.contato,
      endereco: cliente.endereco,
      cpfCnpj: cliente.cpfCnpj,
    });
  };

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
      cliente.cpfCnpj.includes(filtroCpfCnpj)
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
        <Link
          to="/home"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Voltar
        </Link>
      </div>

      <form
        onSubmit={handleSalvarCliente}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={formCliente.nome}
              onChange={(e) =>
                setFormCliente({ ...formCliente, nome: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Contato</Label>
            <Input
              value={formCliente.contato}
              onChange={(e) =>
                setFormCliente({ ...formCliente, contato: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Endereço</Label>
            <Input
              value={formCliente.endereco}
              onChange={(e) =>
                setFormCliente({ ...formCliente, endereco: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>CPF/CNPJ</Label>
            <Input
              value={formCliente.cpfCnpj}
              onChange={(e) =>
                setFormCliente({ ...formCliente, cpfCnpj: e.target.value })
              }
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {editandoCliente ? "Atualizar Cliente" : "Adicionar Cliente"}
        </Button>
        {editandoCliente && (
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

      <div className="flex gap-4 mb-4">
        <div className="w-full">
          <Label>Filtrar por Nome</Label>
          <Input
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Label>Filtrar por CPF/CNPJ</Label>
          <Input
            value={filtroCpfCnpj}
            onChange={(e) => setFiltroCpfCnpj(e.target.value)}
          />
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesFiltrados.map((cliente) => (
          <Card key={cliente.id} className="p-4 space-y-2 flex flex-col">
            <div>
              <h2 className="font-bold">{cliente.nome}</h2>
              <p>Contato: {cliente.contato}</p>
              <p>Endereço: {cliente.endereco}</p>
              <p>CPF/CNPJ: {cliente.cpfCnpj}</p>
            </div>
            
            <div className="flex gap-2 mt-auto pt-4">
              <Button onClick={() => handleEditarCliente(cliente)} className="flex-1">
                Editar
              </Button>
              <Button
                onClick={() => excluirCliente(cliente.id)}
                variant="destructive"
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