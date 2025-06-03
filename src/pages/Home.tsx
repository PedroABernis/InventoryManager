
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Cadastro() {
  const navigate = useNavigate();

  function handleLogout() {

    navigate("/login");
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Gerenciamento</h1>
        <Button onClick={handleLogout} variant="destructive">
          Sair
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Button onClick={() => navigate("/cadastro/produtos")} className="h-32 text-xl">
          Cadastro Produtos
        </Button>
        <Button onClick={() => navigate("/cadastro/clientes")} className="h-32 text-xl">
          Cadastro Clientes
        </Button>
        <Button onClick={() => navigate("/cadastro/fornecedores")} className="h-32 text-xl">
          Cadastro Fornecedores
        </Button>
        <Button onClick={() => navigate("/cadastro/pedidos")} className="h-32 text-xl">
          Pedidos de Venda 
        </Button>
        <Button onClick={() => navigate("/cadastro/entradas")} className="h-32 text-xl">
          Entrada de Produto
        </Button>
      </div>
    </div>
  );
}
