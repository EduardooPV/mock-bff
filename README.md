# Mock BFF (Backend for Frontend) Configuration

Este projeto tem como objetivo fornecer uma interface para configurar e testar um backend mock (BFF) simulado para desenvolvimento de front-end. Ele permite a simulação de erros, configuração de atrasos nas respostas, definição de rotas da API e fornecimento de dados mockados.

O projeto é composto por duas partes principais:

1. **Frontend**: Uma interface de usuário que permite configurar o comportamento do mock API.
2. **Backend**: Uma API que simula as respostas de um servidor real, com configurações personalizáveis (erro, atraso, rota, dados mock).

## Funcionalidades

- Simulação de erros HTTP (500) em vez de dados mockados.
- Configuração de atrasos nas respostas da API.
- Definição de rotas da API.
- Edição e validação de dados mockados no formato JSON.
- Visualização das rotas disponíveis e exclusão de rotas.

## Preview

### Web

https://github.com/user-attachments/assets/37047987-1cef-4f87-ba17-1b826f78d5a2

### Simulando request com sucesso

![Captura de tela 2025-03-12 210631](https://github.com/user-attachments/assets/5468b9b8-2099-441a-b9b5-517a79e8f94e)

### Simulando request com erro

![Captura de tela 2025-03-12 210647](https://github.com/user-attachments/assets/da7c433c-22fa-468e-a9ba-610e2ad8b707)

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

- **Frontend**: Localizado na pasta `/frontend`, contém a interface de usuário.
- **Backend**: Localizado na pasta `/backend`, contém a lógica de simulação da API.

## Instalação das Dependências

Para instalar as dependências de todos os pacotes do projeto (raiz, backend e frontend), utilize os seguintes comandos:

```bash
npm install
npm run install:frontend
npm run install:backend
```

Este comando irá executar o seguinte:

1. Instalar as dependências do `package.json` na raiz do projeto.
2. Instalar as dependências do `package.json` no diretório `/backend`.
3. Instalar as dependências do `package.json` no diretório `/frontend`.

## Como Rodar o Projeto

Após instalar as dependências, você pode iniciar o servidor de desenvolvimento com o seguinte comando:

```bash
npm run dev
```

Este comando irá iniciar simultaneamente os servidores de desenvolvimento do backend e do frontend, permitindo que você teste a aplicação em conjunto.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.
