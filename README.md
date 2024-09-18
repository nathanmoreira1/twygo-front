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
   git clone https://github.com/nathanmoreira1/twygo-front.git
   cd twygo-front

   ```

2. **Crie o arquivo .env.local**

   Copie o arquivo de exemplo (.env.local.example) renomeando-o para .env.local

   Depois, na variável de ambiente API_URL, coloque seu valor como http://<SEU_IP>:3001 trocando "<SEU_IP>" pelo seu IP.

4. **Desenvolvimento com Docker**

   Para iniciar a aplicação utilizando Docker, execute:

   ```bash
   docker-compose up --build

   ```

5. **Acesse a aplicação**

   A aplicação estará disponível em http://<SEU_IP>:3000 dentro do Docker.
