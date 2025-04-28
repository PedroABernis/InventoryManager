
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const navigate = useNavigate();

  function handleCadastro(event: React.FormEvent) {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const userData = {
      nome,
      email,
      senha,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    alert("Usuário cadastrado com sucesso!");

    navigate("/login"); 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCadastro}>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Crie uma senha"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
              <Input
                id="confirmar-senha"
                type="password"
                placeholder="Repita sua senha"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </form>

          <div className="text-center mt-4 text-sm">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Entrar
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

