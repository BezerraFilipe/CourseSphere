# Endpoints da API

Base URL: `http://localhost:3000/api/v1` ou `https://fbms-coursesphere.up.railway.app`

---

## Autenticação

| Método | Rota | Descrição | Auth? |
|--------|------|-----------|-------|
| POST | /auth/register | Criar novo usuário | Não |
| POST | /auth/login | Login, retorna token | Não |
| DELETE | /auth/logout | Invalidar token | Sim |

### POST /auth/register

```json
// Request
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "password": "password123"
}

// Response 201
{
  "token": "abc123...",
  "user": { "id": 1, "name": "Ana Silva", "email": "ana@example.com" }
}

// Response 422 (validação)
{
  "errors": ["Email has already been taken", "Name can't be blank"]
}
```

### POST /auth/login

```json
// Request
{
  "email": "ana@example.com",
  "password": "password123"
}

// Response 200
{
  "token": "novo_token...",
  "user": { "id": 1, "name": "Ana Silva", "email": "ana@example.com" }
}

// Response 401
{
  "error": "Invalid email or password"
}
```

### DELETE /auth/logout

```
Authorization: Bearer <token>

// Response 200
{ "message": "Logged out successfully" }
```

---

## Cursos

Todas as rotas exigem `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /courses | Listar cursos |
| GET | /courses/:id | Detalhes do curso |
| POST | /courses | Criar curso |
| PUT | /courses/:id | Editar curso (só criador) |
| DELETE | /courses/:id | Excluir curso (só criador) |

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `?mine=true` | boolean | Retorna apenas os cursos do usuário autenticado |
| `?search=ruby` | string | Filtra cursos pelo nome (case-insensitive) |

### GET /courses

```json
// Response 200
[
  {
    "id": 1,
    "name": "Introdução ao Ruby",
    "description": "Curso para iniciantes",
    "start_date": "2026-06-01",
    "end_date": "2026-08-01",
    "creator_id": 1,
    "creator_name": "Ana Silva",
    "creator_initial": "A",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

### GET /courses/:id

```json
// Response 200
{
  "course": {
    "id": 1,
    "name": "Introdução ao Ruby",
    "description": "Curso para iniciantes",
    "start_date": "2026-06-01",
    "end_date": "2026-08-01",
    "creator_id": 1,
    "creator_name": "Ana Silva",
    "creator_initial": "A"
  },
  "lessons": [
    {
      "id": 1,
      "title": "Aula 01 - Variáveis",
      "status": "published",
      "video_url": "https://youtube.com/watch?v=abc",
      "course_id": 1
    }
  ]
}
```

### POST /courses

```json
// Request
{
  "name": "Introdução ao Ruby",
  "description": "Curso para iniciantes",
  "start_date": "2026-06-01",
  "end_date": "2026-08-01"
}

// Response 201 — objeto do curso criado
// Response 422 — erros de validação
```

---

## Aulas

Todas as rotas exigem `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /courses/:course_id/lessons | Listar aulas do curso |
| POST | /courses/:course_id/lessons | Criar aula (só criador do curso) |
| PUT | /courses/:course_id/lessons/:id | Editar aula (só criador do curso) |
| DELETE | /courses/:course_id/lessons/:id | Excluir aula (só criador do curso) |

### Parâmetros de query

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `?status=draft` | string | Filtra aulas por status (`draft` ou `published`) |

### POST /courses/:course_id/lessons

```json
// Request
{
  "title": "Aula 01 - Variáveis",
  "status": "draft",
  "video_url": "https://youtube.com/watch?v=abc"
}

// Response 201
{
  "id": 1,
  "title": "Aula 01 - Variáveis",
  "status": "draft",
  "video_url": "https://youtube.com/watch?v=abc",
  "course_id": 1
}

// Response 403
{ "error": "Forbidden" }

// Response 422
{ "errors": ["Title is too short (minimum is 3 characters)"] }
```

---

## Códigos de resposta

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Criado com sucesso |
| 401 | Não autenticado (token inválido ou ausente) |
| 403 | Proibido (sem permissão para esta ação) |
| 404 | Recurso não encontrado |
| 422 | Erro de validação |
