import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    const userDataString = localStorage.getItem('user');
    
    if (!userDataString) {
      alert("Nenhum usuário cadastrado. Por favor, crie uma conta.");
      return;
    }

    const userData = JSON.parse(userDataString);

    if (userData.email === email && userData.senha === senha) {
      alert("Login bem-sucedido!");
      navigate("/home"); 
    } else {
      alert("Email ou senha incorretos.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <Button className="w-full mt-4" type="submit">
            Entrar
          </Button>
        </form>

        <div className="text-center text-sm mt-4">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
