# Mock BFF (Backend for Frontend) Configuration

Este projeto tem como objetivo fornecer uma interface para configurar e testar um backend mock (BFF) simulado para desenvolvimento de front-end. Ele permite a simulação de erros, configuração de atrasos nas respostas, definição de rotas da API e fornecimento de dados mockados.

O projeto é composto por duas partes principais: o **Backend** (onde as rotas e a lógica de mock são configuradas) e o **Frontend** (uma interface de usuário para configurar o mock e visualizar as rotas).

## Funcionalidades

- Simulação de erros HTTP (500) em vez de dados mockados.
- Configuração de atrasos nas respostas da API.
- Definição de rotas da API.
- Edição e validação de dados mockados no formato JSON.
- Visualização das rotas disponíveis e exclusão de rotas.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

1. **Frontend**: Interface de usuário que permite configurar o comportamento do mock API.
2. **Backend**: API que simula as respostas de um servidor real, com configurações personalizáveis (erro, atraso, rota, dados mock).
