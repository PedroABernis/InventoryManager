import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

interface Cliente {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface ItemPedido {
  produtoId: number;
  quantidade: number;
}

interface Pedido {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  total: number;
  data: string;
  concluido: boolean;
}

const Pedidos: React.FC = () => {

  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const pedidosSalvos = localStorage.getItem("pedidos");
    try {
      return pedidosSalvos ? JSON.parse(pedidosSalvos) : [];
    } catch (e) {
      console.error("Erro ao carregar pedidos do localStorage:", e);
      return []; 
    }
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [clienteId, setClienteId] = useState<number>(0);
  const [produtoId, setProdutoId] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [itens, setItens] = useState<ItemPedido[]>([]);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoItemIndex, setEditandoItemIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const clientesLS = localStorage.getItem("clientes");
    if (clientesLS) {
      setClientes(JSON.parse(clientesLS));
    }

    const produtosLS = localStorage.getItem("produtos");
    if (produtosLS) {
      setProdutos(JSON.parse(produtosLS));
    }
  
  }, []);

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  const calcularTotal = (itens: ItemPedido[]): number => {
    return itens.reduce((total, item) => {
      const produto = produtos.find((p) => p.id === item.produtoId);
      return total + (produto ? produto.preco * item.quantidade : 0);
    }, 0);
  };

  const adicionarItem = () => {
    if (!produtoId || quantidade <= 0) return;
    setItens((prev) => [...prev, { produtoId, quantidade }]);
    setProdutoId(0);
    setQuantidade(1);
  };

  const editarItem = (index: number) => {
    const item = itens[index];
    setProdutoId(item.produtoId);
    setQuantidade(item.quantidade);
    setEditandoItemIndex(index);
  };

  const salvarItemEditado = () => {
    if (editandoItemIndex === null || !produtoId || quantidade <= 0) return;
    setItens((prev) => {
      const novos = [...prev];
      novos[editandoItemIndex] = { produtoId, quantidade };
      return novos;
    });
    setProdutoId(0);
    setQuantidade(1);
    setEditandoItemIndex(null);
  };

  const removerItem = (index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
    if (editandoItemIndex === index) {
      setProdutoId(0);
      setQuantidade(1);
      setEditandoItemIndex(null);
    }
  };

  const salvarPedido = () => {
    if (!clienteId || itens.length === 0) return;

    if (editandoId !== null) {
      setPedidos((prev) => {
        const updated = prev.map((p) =>
          p.id === editandoId
            ? { ...p, clienteId, itens, total: calcularTotal(itens) }
            : p
        );
        return updated; 
      });
      setEditandoId(null);
    } else {
      const novo: Pedido = {
        id: Date.now(),
        clienteId,
        itens,
        total: calcularTotal(itens),
        data: new Date().toISOString(),
        concluido: false,
      };
      setPedidos((prev) => {
        const appended = [...prev, novo];
        return appended; 
      });
    }

    setClienteId(0);
    setItens([]);
    setProdutoId(0);
    setQuantidade(1);
    setEditandoItemIndex(null);
  };

  const excluirPedido = (id: number) => {
    setPedidos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      return filtered;
    });
  };

  const editarPedido = (pedido: Pedido) => {
    setClienteId(pedido.clienteId);
    setItens(pedido.itens);
    setEditandoId(pedido.id);
    setProdutoId(0);
    setQuantidade(1);
    setEditandoItemIndex(null);
  };

  const alternarConclusao = (id: number) => {
    setPedidos((prev) => {
      const toggled = prev.map((p) =>
        p.id === id ? { ...p, concluido: !p.concluido } : p
      );
      return toggled; 
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6">Cadastro de Pedidos</h1>
        <Link
          to="/home"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar
        </Link>
      </div>

      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-bold">
          {editandoId ? "Editar Pedido" : "Novo Pedido"}
        </h2>

        <div>
          <Label htmlFor="cliente">Cliente</Label>
          <select
            id="cliente"
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value={0}>Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="produto">Produto</Label>
            <select
              id="produto"
              value={produtoId}
              onChange={(e) => setProdutoId(Number(e.target.value))}
              className="border p-2 rounded w-full"
            >
              <option value={0}>Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} - R${p.preco.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="w-24">
            <Label htmlFor="quantidade">Qtd</Label>
            <Input
              id="quantidade"
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
            />
          </div>

          {editandoItemIndex !== null ? (
            <Button onClick={salvarItemEditado} className="bg-yellow-500">
              Salvar Alteração
            </Button>
          ) : (
            <Button onClick={adicionarItem}>Adicionar</Button>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Itens do Pedido</h3>
          {itens.length === 0 ? (
            <p className="text-gray-500">Nenhum item adicionado.</p>
          ) : (
            <ul className="list-disc pl-5">
              {itens.map((item, idx) => {
                const prod = produtos.find((p) => p.id === item.produtoId);
                return (
                  <li key={idx} className="flex items-center justify-between">
                    <span>
                      {prod?.nome} - {item.quantidade} x R$
                      {prod?.preco.toFixed(2)} = R$
                      {(prod?.preco ? prod.preco * item.quantidade : 0).toFixed(
                        2
                      )}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => editarItem(idx)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removerItem(idx)}
                      >
                        Remover
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Button
          onClick={salvarPedido}
          className={`${
            editandoId ? "bg-blue-600" : "bg-green-600"
          } text-white`}
        >
          {editandoId ? "Atualizar Pedido" : "Salvar Pedido"}
        </Button>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Pedidos Realizados</h2>
        {pedidos.length === 0 && (
          <p className="text-gray-500">Nenhum pedido cadastrado.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidos.map((ped) => {
            const cli = clientes.find((c) => c.id === ped.clienteId);
            return (
              <Card
                key={ped.id}
                className="p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <p>
                    <strong>Cliente:</strong> {cli?.nome}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(ped.data).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total:</strong> R$ {ped.total.toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {ped.concluido ? "Entregue" : "Pendente"}
                  </p>

                  <div className="mt-2">
                    <h4 className="font-semibold">Itens:</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {ped.itens.map((item, i) => {
                        const prod = produtos.find(
                          (p) => p.id === item.produtoId
                        );
                        return (
                          <li key={i}>
                            {prod?.nome} - {item.quantidade} x R$
                            {prod?.preco.toFixed(2)} = R$
                            {(prod?.preco
                              ? prod.preco * item.quantidade
                              : 0
                            ).toFixed(2)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-200">
                  <Button size="sm" onClick={() => editarPedido(ped)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => excluirPedido(ped.id)}
                  >
                    Excluir
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => alternarConclusao(ped.id)}
                    className="flex-grow"
                  >
                    {ped.concluido
                      ? "Pendente"
                      : "Concluído"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
