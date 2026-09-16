API Express + Sequelize + MySQL/MariaDB da Libra Crédito: CMS autenticado, upload e leads.

## Setup

1. Copie `.env.example` para `.env` e preencha banco, `TOKEN_SECRET_ADMIN` e `CORS_ORIGIN`.
2. Crie o banco (`DATABASE`, padrão `libra`).
3. Instale e suba as tabelas:

```bash
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
npm run dev
```

API na porta **3018**. Front Vite: `http://localhost:5173`.

## Seed do admin

- email: `admin@libracredito.com.br`
- senha: `LibraAdmin@123`

Não existe cadastro público de admin.

## Rotas

Público: `GET /conteudo`, `GET /blog`, `GET /blog/:slug`, `POST /leads`, estáticos `/images` e `/videos`.

Admin (header `Authorization: Bearer <token>`): `POST /token`, `GET /admin/me`, `PUT /conteudo`, `POST /upload/imagem`, `POST /upload/video`, CRUD `/admin/blog`, `GET /admin/leads`, `PATCH /admin/leads/:id`.

Upload multipart: campo `file`. Resposta `{ "url": "/images/..." }` ou `{ "url": "/videos/..." }`.
