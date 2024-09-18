# Frontend - Next.js

## Descrição

Este é o frontend desenvolvido com Next.js para interagir com a API backend. O projeto utiliza Docker para facilitar o desenvolvimento e a configuração do ambiente. A aplicação é responsável por exibir informações dos cursos e vídeos de forma interativa e moderna.

## Tecnologias

- Next.js
- React
- Docker

## Pré-requisitos

- Node.js (para desenvolvimento local)
- Docker (para desenvolvimento com contêineres)
- Docker Compose (para orquestrar os contêineres)

## Configuração

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio

   ```

2. **Crie o arquivo .env.local**

   Copie o arquivo de exemplo e ajuste as variáveis conforme necessário:

   ```bash
   cp .env.local.example .env.local

   ```

3. **Desenvolvimento com Docker**

   Para iniciar a aplicação utilizando Docker, execute:

   ```bash
   docker-compose up --build

   ```

4. **Acesse a aplicação**

   A aplicação estará disponível em http://localhost:3000 dentro do Docker.
