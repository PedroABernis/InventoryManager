import React, { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

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
}

const Pedidos: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [clienteId, setClienteId] = useState<number>(0);
  const [produtoId, setProdutoId] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [itens, setItens] = useState<ItemPedido[]>([]);

  useEffect(() => {
    const clientesLS = localStorage.getItem('clientes');
    const produtosLS = localStorage.getItem('produtos');
    const pedidosLS = localStorage.getItem('pedidos');

    if (clientesLS) setClientes(JSON.parse(clientesLS));
    if (produtosLS) setProdutos(JSON.parse(produtosLS));
    if (pedidosLS) setPedidos(JSON.parse(pedidosLS));
  }, []);

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  const calcularTotal = (itens: ItemPedido[]): number => {
    return itens.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.produtoId);
      return total + (produto ? produto.preco * item.quantidade : 0);
    }, 0);
  };

  const adicionarItem = () => {
    if (!produtoId || quantidade <= 0) return;
    setItens(prev => [...prev, { produtoId, quantidade }]);
    setProdutoId(0);
    setQuantidade(1);
  };

  const salvarPedido = () => {
    if (!clienteId || itens.length === 0) return;

    const novoPedido: Pedido = {
      id: Date.now(),
      clienteId,
      itens,
      total: calcularTotal(itens),
    };

    setPedidos(prev => [...prev, novoPedido]);
    setClienteId(0);
    setItens([]);
  };

  const excluirPedido = (id: number) => {
    setPedidos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-4 space-y-6">
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Novo Pedido</h2>

        <div>
          <Label htmlFor="cliente">Cliente</Label>
          <select
            id="cliente"
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            <option value={0}>Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
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
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - R${produto.preco.toFixed(2)}
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

          <Button onClick={adicionarItem}>Adicionar</Button>
        </div>

        <div>
          <h3 className="font-semibold">Itens do Pedido</h3>
          <ul className="list-disc pl-5">
            {itens.map((item, index) => {
              const produto = produtos.find(p => p.id === item.produtoId);
              return (
                <li key={index}>
                  {produto?.nome} - {item.quantidade} x R${produto?.preco?.toFixed(2)} = R$
                  {(produto?.preco ? produto.preco * item.quantidade : 0).toFixed(2)}
                </li>
              );
            })}
          </ul>
        </div>

        <Button onClick={salvarPedido} className="bg-green-600 text-white">
          Salvar Pedido
        </Button>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Pedidos Realizados</h2>
        {pedidos.length === 0 && <p className="text-gray-500">Nenhum pedido cadastrado.</p>}

        {pedidos.map((pedido) => {
          const cliente = clientes.find(c => c.id === pedido.clienteId);
          return (
            <Card key={pedido.id} className="p-4">
              <p><strong>Cliente:</strong> {cliente?.nome}</p>
              <p><strong>Total:</strong> R${pedido.total.toFixed(2)}</p>
              <ul className="list-disc pl-5 mt-2">
                {pedido.itens.map((item, index) => {
                  const produto = produtos.find(p => p.id === item.produtoId);
                  return (
                    <li key={index}>
                      {produto?.nome} - {item.quantidade} x R${produto?.preco.toFixed(2)}
                    </li>
                  );
                })}
              </ul>
              <Button onClick={() => excluirPedido(pedido.id)} className="mt-3 bg-red-500 text-white">
                Excluir
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Pedidos;
