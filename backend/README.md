# Backend - Mock BFF Configuration

Este é o backend para o projeto de configuração de um backend mock (BFF). Ele gerencia as rotas mockadas, processa as configurações de simulação de erros, atrasos nas respostas e dados mockados, retornando conforme as configurações feitas na interface frontend.

## Funcionalidades

- **Simulação de Erros**: Retorna um erro 500 quando a configuração `simulateError` está ativada.
- **Atraso nas Respostas**: Introduz um atraso na resposta da API, configurável conforme a configuração do frontend.
- **Rotas da API**: Permite que o frontend defina rotas e as armazene para serem usadas nas requisições.
- **Dados Mockados**: Retorna dados mockados em formato JSON configuráveis pelo frontend.

## Tecnologias Utilizadas

- **Node.js** (versão 16 ou superior)
- **Express** para criar a API
- **Cors** para permitir requisições cross-origin

## Como Executar o Projeto

1. **Instalação das Dependências**:

   ```bash
   npm install
   ```

2. **Executar o Servidor**:
   Para iniciar o servidor em modo de desenvolvimento, use:

   ```bash
   npm run dev
   ```

3. **Acessar a API**:
   O servidor estará disponível em `http://localhost:3000`. Você pode acessar as rotas configuradas, como:
   - `GET /routes` - Lista todas as rotas disponíveis.
   - `POST /api/config` - Atualiza a configuração do mock.
   - `GET /api/:route` - Acessa uma rota mockada.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Para isso, faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License.
