# trabalho_dev_web
# Lanchonete

Trabalho prático da disciplina **Desenvolvimento Web I** - Universidade do Contestado (UnC), curso de Engenharia de Software.

## Objetivo

Sistema para organizar os pedidos de uma lanchonete: cadastrar clientes e produtos, montar pedidos com carrinho, acompanhar o andamento de cada pedido e consultar indicadores de vendas em um dashboard.

Os dados ficam salvos no `localStorage` do navegador, então continuam disponíveis depois de recarregar a página.

## Integrantes

- Richard Selonke Nunes - *(preencher)*
- Kauã Vitor Pereira Ramos - *(preencher)*

Turma: *(preencher)*

## Funcionalidades

- **Dashboard:** total vendido, pedidos pendentes, ticket médio, produtos com estoque baixo e produto mais vendido, todos calculados a partir dos dados cadastrados.
- **Clientes:** cadastrar, listar, editar e excluir, com validação e busca. Não é possível excluir um cliente que tenha pedidos.
- **Produtos:** cadastrar, listar, editar e excluir, com validação, busca, filtro por categoria e ordenação. Produtos com pouco estoque recebem um aviso. Não é possível excluir um produto que esteja em algum pedido.
- **Novo pedido:** escolha do cliente, carrinho de itens (soma quantidades repetidas e não permite passar do estoque) e forma de pagamento. Ao finalizar, o estoque é baixado automaticamente.
- **Desconto automático:** pedidos com subtotal acima de R$ 50,00 recebem 10% de desconto (funcionalidade exclusiva do tema).
- **Pedidos:** lista com busca por nome do cliente, filtros combináveis por status e pagamento e ordenação por data e valor.
- **Status do pedido:** pendente → em preparo → entregue, avançando um passo por vez. Pedidos pendentes ou em preparo podem ser cancelados, e o estoque é devolvido.
- **Tema claro/escuro:** botão no menu, com a escolha salva no navegador.

## Como executar

Não precisa instalar nada.

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador.

Ou acesse a versão publicada no GitHub Pages: *(colocar o link)*

> É preciso ter internet para carregar o Bootstrap, que é usado via CDN.

## Tecnologias

- HTML5
- CSS3 (arquivo próprio com a identidade visual do projeto)
- JavaScript puro (sem bibliotecas)
- Bootstrap 5.3 (via CDN)
- `localStorage` para guardar os dados

## Estrutura do projeto

```
index.html          Página única com as 5 seções e o modal de exclusão
css/
  style.css         Identidade visual e ajustes do tema escuro
js/
  storage.js        Funções de localStorage, geração de id e formatação de moeda
  ui.js             Alertas, mensagens de erro de formulário e modal de exclusão
  clientes.js       CRUD de clientes
  produtos.js       CRUD de produtos
  pedidos.js        Carrinho, desconto, finalização, status e lista de pedidos
  dashboard.js      Indicadores do dashboard
  tema.js           Alternância de tema claro/escuro
  app.js            Navegação entre as seções
```

## Divisão de responsabilidades

| Integrante | Responsabilidades |
|---|---|
| *(nome)* | *(preencher: por exemplo, interface inicial, navegação, CRUD de clientes e produtos)* |
| *(nome)* | *(preencher: por exemplo, pedidos, dashboard, tema escuro, README)* |