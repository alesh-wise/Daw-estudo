# DAW — Food Store 🛒

<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
</p>

> **Repositório de estudo.** Este projeto é uma réplica do repositório desenvolvido nas aulas de laboratório da cadeira de **Desenvolvimento de Aplicações Web (DAW)** da Universidade do Algarve. Refiz os laboratórios (Lab 1 a Lab 5) por conta própria como método de estudo, adaptando o tema do catálogo de livros das aulas para um catálogo de produtos de supermercado.

## Sobre o projeto

Aplicação full-stack simples para gerir o catálogo de uma loja alimentar:

- **Backend** em Node.js + Express 5 com uma API REST de produtos (CRUD).
- **Persistência** em ficheiro com [NeDB](https://github.com/seald/nedb) (`products.db`), através de um padrão *Repository*.
- **Validação** do corpo dos pedidos com JSON Schema ([Ajv](https://ajv.js.org/)) num middleware reutilizável.
- **Notificações em tempo real** com *Server-Sent Events* (SSE): de 5 em 5 segundos o servidor simula a venda de um produto.
- **Frontend** em TypeScript sem framework, servido pelo Vite, com um formulário que cria produtos por `fetch`.
- **Tipos partilhados** entre frontend e backend em `shared/types.ts`.
- **Monorepo** com *npm workspaces*.

## Conceitos praticados

| Tema | Onde |
| --- | --- |
| Rotas REST e códigos HTTP (200, 201, 204, 400, 404, 500) | `backend/src/features/products/products.routes.ts` |
| Middlewares (CORS, compressão gzip, parser JSON, ficheiros estáticos, fallback 404) | `backend/src/app.ts` |
| Validação com JSON Schema | `products.schema.ts`, `middlewares/validation.middleware.ts` |
| Padrão Repository e callbacks → Promises (`async/await`) | `products.repository.ts` |
| Server-Sent Events (`text/event-stream`, `setInterval`, `req.on('close')`) | rota `GET /api/events` |
| DOM, `fetch` e `EventSource` no browser | `frontend/src/main.ts` |

## Estrutura

```
.
├── backend/
│   ├── src/
│   │   ├── app.ts                      # configuração do Express e middlewares
│   │   ├── server.ts                   # arranque do servidor (porta 3000)
│   │   ├── middlewares/
│   │   │   └── validation.middleware.ts
│   │   └── features/products/
│   │       ├── products.routes.ts      # endpoints REST + SSE
│   │       ├── products.repository.ts  # acesso ao NeDB
│   │       └── products.schema.ts      # JSON Schema do produto
│   └── package.json
├── frontend/
│   ├── index.html                      # formulário de criação de produtos
│   ├── src/main.ts                     # envio do formulário e feed SSE
│   └── package.json
├── shared/
│   └── types.ts                        # Product, ProductCategory, Order...
└── package.json                        # workspaces e scripts globais
```

## Como correr

### Requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- npm (vem com o Node.js)

### 1. Clonar e instalar

```bash
git clone https://github.com/alesh-wise/Daw-estudo.git
cd Daw-estudo
npm install
```

O `npm install` na raiz instala as dependências do backend e do frontend de uma só vez (npm workspaces).

### 2. Arrancar em modo de desenvolvimento

Backend e frontend ao mesmo tempo:

```bash
npm run dev
```

Ou cada um num terminal:

```bash
npm run dev:backend    # API em http://localhost:3000 (recarrega ao guardar, via tsx watch)
npm run dev:frontend   # Vite em http://localhost:5173
```

Abre http://localhost:5173 no browser para usar o formulário.

### 3. Compilar

```bash
npm run build
```

> A base de dados `products.db` é criada automaticamente na pasta `backend/` no primeiro arranque e está no `.gitignore`. Para recomeçar do zero, basta apagá-la.

## API

URL base: `http://localhost:3000/api`

| Método | Endpoint | Descrição | Respostas |
| --- | --- | --- | --- |
| `GET` | `/products` | Lista todos os produtos | 200, 500 |
| `GET` | `/products/:id` | Obtém um produto | 200, 404, 500 |
| `POST` | `/products` | Cria um produto | 201, 400, 500 |
| `PUT` | `/products/:id` | Atualiza um produto | 200, 400, 404, 500 |
| `DELETE` | `/products` | Remove um produto (ver *Pontos em aberto*) | 204, 404, 500 |
| `GET` | `/events` | Stream SSE de notificações de vendas | 200 |

Qualquer outro caminho em `/api/*` devolve `404 { "message": "Endpoint não encontrado" }`.

### Modelo de produto

```json
{
  "name": "Leite meio-gordo",
  "supplier": "Mimosa",
  "price": 0.89,
  "stock": 120,
  "category": 1,
  "description": "Pacote de 1 L"
}
```

| Campo | Tipo | Regras |
| --- | --- | --- |
| `name` | string | obrigatório, pelo menos 1 caráter |
| `supplier` | string | obrigatório, pelo menos 1 caráter |
| `price` | number | obrigatório, maior que 0 |
| `stock` | number | obrigatório, maior ou igual a 0 |
| `category` | integer | obrigatório: `0` = Frozen, `1` = Fresh |
| `description` | string | opcional |

O `id` é gerado pelo servidor. Campos a mais são rejeitados (`additionalProperties: false`).

### Exemplos com `curl`

```bash
# Listar produtos
curl http://localhost:3000/api/products

# Criar um produto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Leite meio-gordo","supplier":"Mimosa","price":0.89,"stock":120,"category":1}'

# Obter um produto pelo id
curl http://localhost:3000/api/products/<id>

# Atualizar um produto
curl -X PUT http://localhost:3000/api/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Leite meio-gordo","supplier":"Mimosa","price":0.95,"stock":100,"category":1}'

# Ouvir as notificações em tempo real (Ctrl+C para sair)
curl -N http://localhost:3000/api/events
```

Um pedido inválido devolve `400` com a lista de erros do Ajv:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"","price":-1}'
```

## Pontos em aberto

Como é um repositório de estudo, ficaram algumas coisas por acabar:

- A rota `DELETE` está registada em `/products` em vez de `/products/:id`, por isso ainda não encontra o produto a apagar.
- O `<select>` de categorias do `index.html` envia nomes (`"Fresh"`, `"Frozen"`…) e o backend espera o número do enum; algumas opções ainda não existem em `ProductCategory`.
- O `index.html` ainda não tem o elemento `#live-notifications`, por isso o feed SSE só se vê com `curl` ou nas DevTools.
- O array de produtos de exemplo (`seedBooks`) está vazio.

## Autor

**Alexandre Guerreiro**: estudante de Engenharia Informática na Universidade do Algarve ([@alesh-wise](https://github.com/alesh-wise)).
