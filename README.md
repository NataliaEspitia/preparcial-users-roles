# Preparcial - Sistema de Usuarios y Roles

Aplicación desarrollada con NestJS para gestionar autenticación, autorización por roles y persistencia en PostgreSQL.

## Tecnologías usadas

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Passport JWT
- bcryptjs
- class-validator

## Requisitos

- Node.js
- npm
- PostgreSQL

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/NataliaEspitia/preparcial-users-roles.git
cd preparcial-users-roles
npm install

npm run format
npm run lint

Ejecutar migración:

psql -U postgres -d preparcial_users_roles -f src/database/migrations/001_create_users_roles.sql

Ejecutar seeds:

psql -U postgres -d preparcial_users_roles -f src/database/seeds/001_seed_roles.sql

Ejecutar aplicación
npm run start:dev
Endpoints principales
POST /auth/register
POST /auth/login
GET /users/me — autenticado
GET /users — admin
PATCH /users/:id/roles — admin
POST /roles — admin
GET /roles — admin

```
