import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import PainelProdutos from "./PainelControle";

export default function Cadastro() {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Gerenciamento</h1>
        <Button onClick={handleLogout} variant="destructive">
          Sair
        </Button>
      </header>

      {/* Conteúdo principal com sidebar e painel */}
      <div className="flex flex-1 gap-6">
        {/* Sidebar com botões - altura total e largura fixa */}
        <nav className="flex flex-col gap-4 w-48">
          <Button
            onClick={() => navigate("/cadastro/produtos")}
            className="h-16 text-lg"
          >
            Cadastro Produtos
          </Button>
          <Button
            onClick={() => navigate("/cadastro/clientes")}
            className="h-16 text-lg"
          >
            Cadastro Clientes
          </Button>
          <Button
            onClick={() => navigate("/cadastro/fornecedores")}
            className="h-16 text-lg"
          >
            Cadastro Fornecedores
          </Button>
          <Button
            onClick={() => navigate("/cadastro/pedidos")}
            className="h-16 text-lg"
          >
            Pedidos de Venda
          </Button>
          <Button
            onClick={() => navigate("/cadastro/entradas")}
            className="h-16 text-lg"
          >
            Entrada de Produto
          </Button>
        </nav>

        {/* PainelProdutos ocupa o resto do espaço */}
        <main className="flex-1 bg-white rounded-md shadow p-6 overflow-auto">
          <PainelProdutos />
        </main>
      </div>
    </div>
  );
}
