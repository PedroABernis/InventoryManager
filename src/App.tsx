
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registro from "./pages/Register";
import Login from "./pages/Login"; 
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Cliente";
import Fornecedores from "./pages/Fornecedores";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/register" element={<Registro />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/cadastro" element={<Home />} />
        <Route path="/cadastro/produtos" element={<Produtos />} />
        <Route path="/cadastro/clientes" element={<Clientes />} />
        <Route path="/cadastro/fornecedores" element={<Fornecedores />} />
      </Routes>
    </Router>
  );
}

export default App;
