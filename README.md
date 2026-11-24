# 📦 InventoryManager

Sistema web de gerenciamento de estoque desenvolvido para auxiliar no controle de produtos, clientes, fornecedores, pedidos de venda e movimentações de estoque.

O projeto reúne funcionalidades de gerenciamento operacional em uma interface intuitiva, permitindo organizar cadastros, acompanhar produtos e registrar operações comerciais.

## 🚀 Funcionalidades

### 📋 Gerenciamento de produtos
- Cadastro de produtos com nome, preço, descrição, fornecedor e imagem.
- Edição e exclusão de produtos.
- Pesquisa por nome.
- Filtro por fornecedor.
- Ordenação por preço.
- Controle de status dos produtos (ativo/inativo).

### 👥 Gerenciamento de clientes
- Cadastro de clientes.
- Registro de informações de contato, endereço e CPF/CNPJ.
- Edição e exclusão de cadastros.
- Filtros para facilitar a consulta.

### 🏭 Gerenciamento de fornecedores
- Cadastro de fornecedores.
- Registro de informações como CNPJ, cidade, CEP e estado.
- Edição e exclusão de registros.

### 🛒 Gerenciamento de pedidos
- Registro de pedidos vinculados a clientes.
- Adição de produtos e quantidades aos pedidos.
- Cálculo do valor total dos pedidos.
- Edição e gerenciamento de pedidos.

### 📥 Entrada de produtos
- Registro de entradas de mercadorias.
- Associação de entradas a fornecedores.
- Registro de produtos, quantidades e valores.
- Atualização das movimentações de estoque.

### 📊 Painel de gerenciamento
- Consulta de produtos cadastrados.
- Visualização de preços, custos, estoque e percentual de lucro.
- Controle de status dos produtos.
- Histórico de movimentações de estoque.

## 🛠️ Tecnologias utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Radix UI
- Lucide React

## 💾 Armazenamento

Nesta versão, a aplicação utiliza `localStorage` do navegador para armazenar dados de cadastros e operações, permitindo que as informações permaneçam disponíveis entre sessões no mesmo navegador.

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js
- npm

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/PedroABernis/InventoryManager.git
   ```

2. Acesse a pasta do projeto:

   ```bash
   cd InventoryManager
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Execute a aplicação:

   ```bash
   npm run dev
   ```

5. Acesse o endereço disponibilizado pelo Vite no terminal.

## 📌 Considerações

O InventoryManager é um projeto em desenvolvimento, construído com o objetivo de explorar o desenvolvimento de aplicações web, organização de funcionalidades e gerenciamento de operações relacionadas a estoque.

O armazenamento atual é local ao navegador, não sendo uma solução de persistência centralizada entre diferentes usuários ou dispositivos.

## 🔮 Melhorias futuras

- Implementação de backend.
- Integração com banco de dados.
- Aprimoramento da autenticação e gerenciamento de usuários.
- Expansão dos indicadores e relatórios.
- Aprimoramento do histórico de movimentações.
- Evolução da arquitetura e organização do sistema.

## 👨‍💻 Autor

**Pedro Bernis**

GitHub: [PedroABernis](https://github.com/PedroABernis)

---

*Projeto desenvolvido para fins de aprendizado e evolução prática em desenvolvimento web.*
