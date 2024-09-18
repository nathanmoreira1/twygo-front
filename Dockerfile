# Use uma imagem base com a versão desejada do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código fonte para o contêiner
COPY . .

# Expõe a porta que o Next.js usa
EXPOSE 3000

# Define o comando para iniciar o servidor
CMD ["npm", "run", "dev"]
