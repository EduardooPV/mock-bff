<h1 align="center">Mock BFF</h1>

<p align="center">
  Interface para configurar e testar um backend mock (BFF) simulado no desenvolvimento de front-end.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-runtime-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-API-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre o projeto</a> ·
  <a href="#stack">Stack</a> ·
  <a href="#funcionalidades">Funcionalidades</a> ·
  <a href="#preview">Preview</a> ·
  <a href="#como-rodar">Como rodar</a>
</p>

---

## Sobre o projeto

Este projeto tem como objetivo fornecer uma interface para configurar e testar um backend mock (BFF) simulado para desenvolvimento de front-end. Ele permite a simulação de erros, configuração de atrasos nas respostas, definição de rotas da API e fornecimento de dados mockados.

O projeto é composto por duas partes principais:

1. **Frontend**: Uma interface de usuário que permite configurar o comportamento do mock API.
2. **Backend**: Uma API que simula as respostas de um servidor real, com configurações personalizáveis (erro, atraso, rota, dados mock).

---

## Stack

| Camada    | Tecnologia                     |
|-----------|--------------------------------|
| Frontend  | Vue 3 + Vite + Tailwind CSS    |
| Backend   | Node.js + Express              |

---

## Funcionalidades

- Simulação de erros HTTP (500) em vez de dados mockados.
- Configuração de atrasos nas respostas da API.
- Definição de rotas da API.
- Edição e validação de dados mockados no formato JSON.
- Visualização das rotas disponíveis e exclusão de rotas.

---

## Preview

### Página inicial
![image](https://github.com/user-attachments/assets/dc8d2bb9-77f4-4d0b-97d8-c26bcd2eb5ab)

### Popup detalhes da rota
![image](https://github.com/user-attachments/assets/f7a6dbbb-10de-4dbd-be61-def496c73fb8)

### Simulando request com sucesso
![image](https://github.com/user-attachments/assets/17c1b13a-d20f-408c-bde3-09562e7724ad)

### Simulando request com erro
![image](https://github.com/user-attachments/assets/023d42de-efc5-47bc-87b3-a3724c140191)

---

## Como rodar

### Instalação das dependências

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

### Rodando o projeto

Após instalar as dependências, você pode iniciar o servidor de desenvolvimento com o seguinte comando:

```bash
npm run dev
```

Este comando irá iniciar simultaneamente os servidores de desenvolvimento do backend e do frontend, permitindo que você teste a aplicação em conjunto.

---

## Estrutura do repositório

O projeto é dividido em duas partes principais:

- **Frontend**: Localizado na pasta `/frontend`, contém a interface de usuário.
- **Backend**: Localizado na pasta `/backend`, contém a lógica de simulação da API.

---

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

---

<p align="center">
  Desenvolvido por <strong>Luiz Eduardo Veltroni</strong> ·
  <a href="https://github.com/EduardooPV">GitHub</a> ·
  <a href="https://www.linkedin.com/in/luiz-veltroni/">LinkedIn</a>
</p>
