// ===== Novo pedido (carrinho) e lista de pedidos =====

// Regra do desconto automático: subtotal MAIOR que R$ 50 ganha 10%
const VALOR_MINIMO_DESCONTO = 50
const PERCENTUAL_DESCONTO = 0.1

let pedidos = lerDados("pedidos")
let carrinho = []   // itens do pedido que está sendo montado (ainda não foi salvo)

const formPedido = document.getElementById("formPedido")
const selectCliente = document.getElementById("pedidoCliente")
const selectProduto = document.getElementById("pedidoProduto")
const campoQuantidade = document.getElementById("pedidoQuantidade")
const btnAdicionarItem = document.getElementById("btnAdicionarItem")
const selectPagamento = document.getElementById("pedidoPagamento")
const tabelaItensPedido = document.getElementById("tabelaItensPedido")
const textoDesconto = document.getElementById("pedidoDesconto")
const textoTotal = document.getElementById("pedidoTotal")

const tabelaPedidos = document.getElementById("tabelaPedidos")
const buscaPedido = document.getElementById("buscaPedido")
const filtroStatus = document.getElementById("filtroStatus")
const filtroPagamento = document.getElementById("filtroPagamento")
const ordenarPedidos = document.getElementById("ordenarPedidos")




function calcularSubtotal() {
    let subtotal = 0

    for (let item of carrinho) {
        subtotal += item.quantidade * item.precoUnitario
    }
    return subtotal
}

// Funcionalidade so ativa desconto de 10% quando o subtotal passa de R$ 50
function calcularDesconto(subtotal) {
    if (subtotal > VALOR_MINIMO_DESCONTO) {
        return subtotal * PERCENTUAL_DESCONTO
    }
    return 0
}

function nomeDoCliente(clienteId) {
    let cliente = buscarPorId(clientes, clienteId)

    if (cliente === null) {
        return "Cliente removido"
    }
    return cliente.nome
}


// ----- Selects de cliente e produto -----

// Preenche os selects com o que está cadastrado (chamada ao abrir a tela "Novo pedido")
function atualizarSelects() {
    let html = '<option value="">Selecione...</option>'
    for (let cliente of clientes) {
        html += '<option value="' + cliente.id + '">' + cliente.nome + "</option>"
    }
    selectCliente.innerHTML = html

    html = '<option value="">Selecione...</option>'
    for (let produto of produtos) {
        if (produto.estoque === 0) {
            html += '<option value="' + produto.id + '" disabled>' + produto.nome + " (esgotado)</option>"
        } else {
            html += '<option value="' + produto.id + '">' + produto.nome + " - " + formatarMoeda(produto.preco) + " (estoque: " + produto.estoque + ")</option>"
        }
    }
    selectProduto.innerHTML = html
}


// ----- Carrinho -----

// Desenha os itens do carrinho e atualiza desconto e total
function desenharCarrinho() {
    let html = ""

    for (let i = 0; i < carrinho.length; i++) {
        let item = carrinho[i]

        html += "<tr>"
        html += "<td>" + item.nome + "</td>"
        html += "<td>" + item.quantidade + "</td>"
        html += "<td>" + formatarMoeda(item.quantidade * item.precoUnitario) + "</td>"
        html += '<td class="text-end"><button type="button" class="btn btn-sm btn-outline-danger" onclick="removerItem(' + i + ')">Remover</button></td>'
        html += "</tr>"
    }

    if (html === "") {
        html = '<tr><td colspan="4" class="text-muted">Nenhum item adicionado.</td></tr>'
    }
    tabelaItensPedido.innerHTML = html

    let subtotal = calcularSubtotal()
    let desconto = calcularDesconto(subtotal)
    textoDesconto.textContent = formatarMoeda(desconto)
    textoTotal.textContent = formatarMoeda(subtotal - desconto)
}

btnAdicionarItem.addEventListener("click", function () {
    let produto = buscarPorId(produtos, parseInt(selectProduto.value))
    let quantidade = parseInt(campoQuantidade.value)

    if (produto === null) {
        mostrarAlerta("Escolha um produto para adicionar.", "danger")
        return
    }
    if (isNaN(quantidade) || quantidade < 1) {
        mostrarAlerta("A quantidade deve ser 1 ou mais.", "danger")
        return
    }

    // Se o produto já está no carrinho, soma a quantidade
    let itemExistente = null
    for (let item of carrinho) {
        if (item.produtoId === produto.id) {
            itemExistente = item
        }
    }

    let jaNoCarrinho = 0
    if (itemExistente !== null) {
        jaNoCarrinho = itemExistente.quantidade
    }

    // Regra de negócio: não vender mais do que existe em estoque
    if (jaNoCarrinho + quantidade > produto.estoque) {
        mostrarAlerta("Estoque insuficiente de " + produto.nome + ": há " + produto.estoque + " e já tem " + jaNoCarrinho + " no carrinho.", "danger")
        return
    }

    if (itemExistente !== null) {
        itemExistente.quantidade += quantidade
    } else {
        carrinho.push({ produtoId: produto.id, nome: produto.nome, quantidade: quantidade, precoUnitario: produto.preco })
    }

    selectProduto.value = ""
    campoQuantidade.value = 1
    desenharCarrinho()
})

function removerItem(indice) {
    let novoCarrinho = []

    for (let i = 0; i < carrinho.length; i++) {
        if (i !== indice) {
            novoCarrinho.push(carrinho[i])
        }
    }
    carrinho = novoCarrinho
    desenharCarrinho()
}


// ----- Finalizar pedido -----

formPedido.addEventListener("submit", function (evento) {
    evento.preventDefault()

    // Validações
    if (selectCliente.value === "") {
        mostrarAlerta("Escolha o cliente do pedido.", "danger")
        return
    }
    if (carrinho.length === 0) {
        mostrarAlerta("Adicione pelo menos um item ao pedido.", "danger")
        return
    }
    if (selectPagamento.value === "") {
        mostrarAlerta("Escolha a forma de pagamento.", "danger")
        return
    }

    let subtotal = calcularSubtotal()
    let desconto = calcularDesconto(subtotal)

    let pedido = {
        id: gerarId(pedidos),
        clienteId: parseInt(selectCliente.value),
        itens: carrinho,
        pagamento: selectPagamento.value,
        subtotal: subtotal,
        desconto: desconto,
        total: subtotal - desconto,
        status: "pendente",
        data: new Date().toLocaleDateString("pt-BR")
    }

    // Dá baixa no estoque de cada produto vendido
    for (let item of pedido.itens) {
        let produto = buscarPorId(produtos, item.produtoId)
        produto.estoque -= item.quantidade
    }

    pedidos.push(pedido)
    salvarDados("pedidos", pedidos)
    salvarDados("produtos", produtos)

    // Limpa a tela para o próximo pedido
    carrinho = []
    formPedido.reset()
    desenharCarrinho()
    atualizarSelects()
    listarProdutos()
    listarPedidos()

    mostrarAlerta("Pedido #" + pedido.id + " realizado com sucesso!", "success")
})


// ----- Estados do pedido: pendente -> em preparo -> entregue -----

// Devolve o próximo status ("" se o pedido já terminou)
function proximoStatus(status) {
    if (status === "pendente") {
        return "em preparo"
    }
    if (status === "em preparo") {
        return "entregue"
    }
    return ""
}

// Só dá para cancelar enquanto o pedido não foi entregue
function podeCancelar(status) {
    return status === "pendente" || status === "em preparo"
}

// Cor do badge de cada status
function corDoStatus(status) {
    if (status === "pendente") {
        return "text-bg-warning"
    }
    if (status === "em preparo") {
        return "text-bg-info"
    }
    if (status === "entregue") {
        return "text-bg-success"
    }
    return "text-bg-secondary"
}

// Devolve os itens do pedido para o estoque
function devolverEstoque(pedido) {
    for (let item of pedido.itens) {
        let produto = buscarPorId(produtos, item.produtoId)
        produto.estoque += item.quantidade
    }
    salvarDados("produtos", produtos)
    listarProdutos()
}

function avancarStatus(id) {
    let pedido = buscarPorId(pedidos, id)

    pedido.status = proximoStatus(pedido.status)
    salvarDados("pedidos", pedidos)
    listarPedidos()
    mostrarAlerta("Pedido #" + pedido.id + " agora está: " + pedido.status + ".", "success")
}

function cancelarPedido(id) {
    let pedido = buscarPorId(pedidos, id)

    pedido.status = "cancelado"
    devolverEstoque(pedido)
    salvarDados("pedidos", pedidos)
    listarPedidos()
    mostrarAlerta("Pedido #" + pedido.id + " cancelado e estoque devolvido.", "success")
}

function pedirExclusaoPedido(id) {
    tipoExcluir = "pedido"
    idExcluir = id
}

function excluirPedido(id) {
    let pedido = buscarPorId(pedidos, id)

    // Pedido que ainda não foi entregue nem cancelado: o estoque volta
    if (podeCancelar(pedido.status)) {
        devolverEstoque(pedido)
    }

    let novaLista = []
    for (let p of pedidos) {
        if (p.id !== id) {
            novaLista.push(p)
        }
    }
    pedidos = novaLista

    salvarDados("pedidos", pedidos)
    listarPedidos()
    mostrarAlerta("Pedido excluído.", "success")
}


// ----- Lista de pedidos: busca + 2 filtros + ordenação -----

function listarPedidos() {
    let busca = buscaPedido.value.toLowerCase()
    let status = filtroStatus.value
    let pagamento = filtroPagamento.value
    let lista = []

    for (let pedido of pedidos) {
        let achouCliente = nomeDoCliente(pedido.clienteId).toLowerCase().includes(busca)
        let achouStatus = status === "" || pedido.status === status
        let achouPagamento = pagamento === "" || pedido.pagamento === pagamento

        if (achouCliente && achouStatus && achouPagamento) {
            lista.push(pedido)
        }
    }

    // Pedido com id maior é mais recente
    let ordem = ordenarPedidos.value
    lista.sort(function (a, b) {
        if (ordem === "data-asc") {
            return a.id - b.id
        }
        if (ordem === "valor-asc") {
            return a.total - b.total
        }
        if (ordem === "valor-desc") {
            return b.total - a.total
        }
        return b.id - a.id
    })

    let html = ""
    for (let pedido of lista) {
        // Cada botão só aparece quando a ação é permitida
        let botoes = ""
        if (proximoStatus(pedido.status) !== "") {
            botoes += '<button class="btn btn-sm btn-outline-success" onclick="avancarStatus(' + pedido.id + ')">Avançar status</button> '
        }
        if (podeCancelar(pedido.status)) {
            botoes += '<button class="btn btn-sm btn-outline-warning" onclick="cancelarPedido(' + pedido.id + ')">Cancelar</button> '
        }
        botoes += '<button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalExcluir" onclick="pedirExclusaoPedido(' + pedido.id + ')">Excluir</button>'

        html += "<tr>"
        html += "<td>" + pedido.id + "</td>"
        html += '<td>' + nomeDoCliente(pedido.clienteId) + '<small class="text-muted d-block">' + pedido.data + "</small></td>"
        html += "<td>" + formatarMoeda(pedido.total) + "</td>"
        html += "<td>" + pedido.pagamento + "</td>"
        html += '<td><span class="badge ' + corDoStatus(pedido.status) + '">' + pedido.status + "</span></td>"
        html += '<td class="text-end">' + botoes + "</td>"
        html += "</tr>"
    }

    if (html === "") {
        html = '<tr><td colspan="6" class="text-muted">Nenhum pedido encontrado.</td></tr>'
    }
    tabelaPedidos.innerHTML = html
}

buscaPedido.addEventListener("input", listarPedidos)
filtroStatus.addEventListener("change", listarPedidos)
filtroPagamento.addEventListener("change", listarPedidos)
ordenarPedidos.addEventListener("change", listarPedidos)

// Desenha tudo uma vez ao abrir a página
atualizarSelects()
desenharCarrinho()
listarPedidos()
