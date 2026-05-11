# [CourseSphere](https://coursesphere-front.vercel.app/)

Plataforma web colaborativa de gestão de cursos online. 

Qualquer usuário autenticado pode criar cursos e aulas, compartilhar conhecimento e explorar o conteúdo da comunidade.

Desenvolvida como desafio técnico Full Stack (Rails + React).

---

## Stack

|   |   |
|--------|-----------|
| Backend | Ruby on Rails 8.1 (API mode) |
| Banco de dados | PostgreSQL 15 |
| Frontend | React 19 + Vite |
| Infra | Docker + Docker Compose |

Backend e banco com deploy na railway e Frontend com deploy na vercel.

Disponível em https://coursesphere-front.vercel.app/

---

## Estrutura do repositório

```
CourseSphere/
├── backend/        # API Rails
├── frontend/       # App React + Vite
├── docs/           # Documentação adicional
└── README.md
```

---

## Funcionalidades

- Registro e login de usuários com autenticação por token
- Dashboard com todos os cursos da comunidade
- Busca de cursos por nome
- Sanfona por curso exibindo detalhes e aulas
- Instrutor convidado gerado via [RandomUser API](https://randomuser.me)
- Avatar do criador exibido em cada card de curso
- Área "Meus cursos" com CRUD completo
- Criação e edição de aulas com título, URL e status (rascunho/publicada)
- Reaproveitamento de aulas existentes em novos cursos
- Filtro de aulas por status
- Aulas em rascunho visíveis apenas para o criador do curso
- Interface responsiva com sidebar no desktop e bottom bar no mobile

---

## Deploy

| Serviço | URL |
|---------|-----|
| Frontend | https://coursesphere-front.vercel.app |
| Backend | https://fbms-coursesphere.up.railway.app |

> Ao acessar https://fbms-coursesphere.up.railway.app, nada será exibido, essa rota não foi configurada.

> Mas https://fbms-coursesphere.up.railway.app/api/v1/courses vai retornar `{ "error": "Unauthorized" }`, uma vez que a API está no ar, mas você não está autenticado (logado) para ter acesso à essa rota.

---

## Como rodar o projeto localmente


> requisitos: docker compose


```bash
# 1. Clone o repositório
git clone https://github.com/BezerraFilipe/CourseSphere.git
cd CourseSphere

# 2. Configure as variáveis de ambiente
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

> Os valores padrão dos `.env.example` já funcionam sem edição para rodar localmente.

```bash
# 3. Suba os serviços
docker compose up --build

# 4. Rode as migrations e seeds
docker compose exec api bundle exec rails db:migrate db:seed
```

A API estará disponível em `http://localhost:3000` e o frontend em `http://localhost:5173`.

---


## Usuários de teste

Após rodar `db:seed`, os seguintes usuários estarão disponíveis:

| Nome    | E-mail              | Senha       |
|---------|---------------------|-------------|
| Lucas   | lucas@example.com   | password123 |
| Filipe  | filipe@example.com  | password123 |
| Barbara | barbara@example.com | password123 |

Cada usuário possui 2 cursos com 3 aulas cada.

---


## Documentação adicional

Vale a pena dar uma olhada nesses arquivos que explicam um pouco sobre decisões de projeto e como algumas coisas funcionam.


- [Arquitetura, decisões técnicas e implementações](docs/architecture.md)
- [Requisitos implementados](docs/requirements.md)
- [Endpoints da API](docs/api.md)
- [Falhas e melhorias](docs/known-issues.md)
- [Utilização de commits semânticos](docs/git-guide.md)