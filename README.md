# trabalho_dev_web
# Lanchonete

Trabalho prático da disciplina Desenvolvimento Web I - Universidade do Contestado (UnC), curso de Engenharia de Software.

## Objetivo

Sistema para organizar os pedidos de uma lanchonete: cadastrar clientes e produtos, montar pedidos com carrinho, acompanhar o andamento de cada pedido e consultar indicadores de vendas em um dashboard.

Os dados ficam salvos no localStorage do navegador, então continuam disponíveis depois de recarregar a página.

## Integrantes

Richard Selonke Nunes
Kauã Vitor Pereira Ramos



## Funcionalidades

Dashboard: total vendido, pedidos pendentes, ticket médio, produtos com estoque baixo e produto mais vendido, todos calculados a partir dos dados cadastrados.
Clientes: cadastrar, listar, editar e excluir, com validação e busca.
Produtos: cadastrar, listar, editar e excluir, com validação, busca, filtro por categoria e ordenação. Produtos com pouco estoque recebem um aviso. Não é possível excluir um produto que esteja em algum pedido.
Novo pedido: escolha do cliente, carrinho de itens e forma de pagamento. Ao finalizar, o estoque é mudado automaticamente.
Desconto automático: pedidos com subtotal acima de R$ 50,00 recebem 10% de desconto.
Pedidos: lista com busca por nome do cliente, filtros combináveis por status e pagamento e ordenação por data e valor.
Status do pedido: pendente - em preparo - entregue. Pedidos pendentes ou em preparo podem ser cancelados


## Como executar



Baixe ou clone o repositório.
Use o Live Server

Ou acesse a versão publicada no GitHub Pages: Link TBD, ainda estamos trabalhando nesta parte 

É preciso ter internet para carregar o Bootstrap

## Tecnologias

HTML5
CSS
JavaScript 
Bootstrap 5.3 
localStorage 

## Estrutura do projeto


index.html          Página única com as 5 seções e o modal de exclusão
css/
  style.css         Identidade visual 
js/
  storage.js        Funções de localStorage, geração de id e formatação de moeda
  ui.js             Alertas, mensagens de erro de formulário e modal de exclusão
  clientes.js       CRUD de clientes
  produtos.js       CRUD de produtos
  pedidos.js        Carrinho, desconto, finalização, status e lista de pedidos
  dashboard.js      Indicadores do dashboard
  tema.js           Alternância de tema claro/escuro
  app.js            Navegação entre as seções


## Divisão de responsabilidades


Kauã Vitor Pereira Ramos: interface inicial, CRUD de clientes e produtos, CSS, Integração Bootstrap

Richard Selonke Nunes: pedidos, dashboard,  README 