
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registro from "./pages/Register";
import Login from "./pages/Login"; 
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Cliente";
import Fornecedores from "./pages/Fornecedores";
import Pedidos from "./pages/Pedidos";
import EntradaEstoque from "./pages/EntradaProdutos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registro />} /> 
        <Route path="/register" element={<Registro />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro/produtos" element={<Produtos />} />
        <Route path="/cadastro/clientes" element={<Clientes />} />
        <Route path="/cadastro/fornecedores" element={<Fornecedores />} />
        <Route path="/cadastro/pedidos" element={<Pedidos />} />
        <Route path="/cadastro/entradas" element={<EntradaEstoque />} />
      </Routes>
    </Router>
  );
}

export default App;
