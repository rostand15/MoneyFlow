#  MoneyFlow

Aplicação full-stack de controle financeiro pessoal, com autenticação, categorização de transações, metas de gastos e relatórios visuais.

> Projeto desenvolvido para portfólio, com foco em backend/APIs e integração com frontend em React.

## Funcionalidades

-  Autenticação com JWT (cadastro e login)
-  CRUD completo de transações (receitas e despesas)
-  CRUD completo de categorias
-  Metas de gastos mensais por categoria, com barra de progresso
-  Relatório visual (gráfico de pizza) de gastos por categoria
-  Busca e filtro de transações por descrição e mês
-  Cálculo automático de saldo total
-  Landing page e interface responsiva

##  Tecnologias

**Backend**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT (jsonwebtoken) + bcryptjs
- CORS, dotenv

**Frontend**
- React (Vite)
- Tailwind CSS v4
- React Router
- Recharts (gráficos)
- Framer Motion (animações)
- Axios

##  Como rodar localmente

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado e rodando

### Backend

```bash
cd backend
npm install
```


Rode as migrations e inicie o servidor:

```bash
npx prisma migrate dev
npm run dev
```

O backend sobe em `http://localhost:3000`.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

>  É necessário rodar o backend e o frontend ao mesmo tempo (em terminais separados) para a aplicação funcionar.

## 📸 Screenshots

_(em breve)_

##  Deploy

_(em breve)_

##  Próximos passos

- Transações recorrentes (assinaturas mensais)
- Deploy em produção (Render + Vercel)

## 👤 Autor

Desenvolvido por [Rostand] — [(https://www.linkedin.com/in/rostandaraujo/)]

