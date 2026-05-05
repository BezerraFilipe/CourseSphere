# CourseSphere

Aplicação web de gestão de cursos online colaborativa, desenvolvida como desafio técnico Full Stack.

## Stack

- **Backend:** Ruby on Rails (API mode) + PostgreSQL
- **Frontend:** React + Vite
- **Infra:** Docker + Docker Compose

## Estrutura do repositório

```
coursesphere/
├── backend/        # API Rails
├── frontend/       # App React + Vite
├── docs/           # Documentação adicional
└── README.md
```

## Pré-requisitos

- Docker e Docker Compose instalados
- ou, para rodar sem Docker:
  - Ruby 3.3+
  - Node.js 20+
  - PostgreSQL 15+


## Como rodar sem Docker (em breve)

### Backend

```bash
cd backend

bundle install

# config. variáveis de ambiente
cp .env.example .env
# editar .env com credenciais do banco

rails db:create db:migrate db:seed

rails server
```

A API estará disponível em `http://localhost:3000`.

### Frontend

```bash
cd frontend

npm install

npm run dev
```

O frontend estará disponível em `http://localhost:5173`.


---

## Como rodar com Docker

```bash

git clone https://github.com/BezerraFilipe/CourseSphere.git
cd CourseSphere

docker compose up --build

# Em outro terminal
docker compose exec api rails db:create db:migrate db:seed
```

A API estará disponível em `http://localhost:3000` e o frontend em `http://localhost:5173`.

---

