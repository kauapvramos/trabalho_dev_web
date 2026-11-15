// ===== CRUD de produtos =====

let produtos = lerDados("produtos")
let produtoEditandoId = null

const formProduto = document.getElementById("formProduto")
const campoProdutoNome = document.getElementById("produtoNome")
const campoProdutoCategoria = document.getElementById("produtoCategoria")
const campoProdutoPreco = document.getElementById("produtoPreco")
const campoProdutoEstoque = document.getElementById("produtoEstoque")
const tabelaProdutos = document.getElementById("tabelaProdutos")
const buscaProduto = document.getElementById("buscaProduto")
const filtroCategoria = document.getElementById("filtroCategoria")
const ordenarProdutos = document.getElementById("ordenarProdutos")
const btnCancelarProduto = document.getElementById("btnCancelarProduto")

function validarProduto(nome, categoria, preco, estoque) {
    let valido = true
    limparErros(formProduto)

    if (nome.length < 2) {
        marcarErro(campoProdutoNome, "Informe o nome do produto.")
        valido = false
    }
    if (categoria === "") {
        marcarErro(campoProdutoCategoria, "Escolha uma categoria.")
        valido = false
    }
    if (isNaN(preco) || preco <= 0) {
        marcarErro(campoProdutoPreco, "O preço deve ser maior que zero.")
        valido = false
    }
    if (isNaN(estoque) || !Number.isInteger(estoque) || estoque < 0) {
        marcarErro(campoProdutoEstoque, "O estoque deve ser um número inteiro, de 0 para cima.")
        valido = false
    }

    return valido
}

function produtoTemPedidos(id) {
    let pedidos = lerDados("pedidos")

    for (let pedido of pedidos) {
        for (let item of pedido.itens) {
            if (item.produtoId === id) {
                return true
            }
        }
    }
    return false
}

// Aplica busca + filtro de categoria + ordenação e desenha a tabela
function listarProdutos() {
    let termo = buscaProduto.value.trim().toLowerCase()
    let categoria = filtroCategoria.value
    let lista = []

    for (let produto of produtos) {
        let bateBusca = produto.nome.toLowerCase().includes(termo)
        let bateCategoria = categoria === "" || produto.categoria === categoria

        if (bateBusca && bateCategoria) {
            lista.push(produto)
        }
    }

    let ordem = ordenarProdutos.value
    lista.sort(function (a, b) {
        if (ordem === "preco-asc") return a.preco - b.preco
        if (ordem === "preco-desc") return b.preco - a.preco
        if (ordem === "estoque-asc") return a.estoque - b.estoque
        return a.nome.localeCompare(b.nome)
    })

    let html = ""
    for (let produto of lista) {
        let aviso = ""
        if (produto.estoque <= LIMITE_ESTOQUE_BAIXO) {
            aviso = ` <span class="badge text-bg-danger">Estoque baixo</span>`
        }

        html += `
            <tr>
                <td>${escapar(produto.nome)}</td>
                <td>${escapar(produto.categoria)}</td>
                <td>${formatarMoeda(produto.preco)}</td>
                <td>${produto.estoque}${aviso}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-dark" data-acao="editar" data-id="${produto.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${produto.id}">Excluir</button>
                </td>
            </tr>`
    }

    if (html === "") {
        html = `<tr><td colspan="5" class="text-muted">Nenhum produto encontrado.</td></tr>`
    }
    tabelaProdutos.innerHTML = html
}

function sairDaEdicaoProduto() {
    produtoEditandoId = null
    formProduto.reset()
    limparErros(formProduto)
    document.getElementById("tituloFormProduto").textContent = "Cadastrar produto"
    btnCancelarProduto.classList.add("d-none")
}

function editarProduto(id) {
    let produto = buscarPorId(produtos, id)

    produtoEditandoId = id
    campoProdutoNome.value = produto.nome
    campoProdutoCategoria.value = produto.categoria
    campoProdutoPreco.value = produto.preco
    campoProdutoEstoque.value = produto.estoque

    document.getElementById("tituloFormProduto").textContent = "Editar produto"
    btnCancelarProduto.classList.remove("d-none")
    campoProdutoNome.focus()
}

function excluirProduto(id) {
    let produto = buscarPorId(produtos, id)

    if (produtoTemPedidos(id)) {
        mostrarAlerta("Não é possível excluir: este produto já está em pedidos.", "danger")
        return
    }

    confirmarExclusao("Deseja excluir o produto " + produto.nome + "?", function () {
        produtos = produtos.filter(function (p) {
            return p.id !== id
        })
        salvarDados("produtos", produtos)
        listarProdutos()
        mostrarAlerta("Produto excluído.", "success")
    })
}

formProduto.addEventListener("submit", function (evento) {
    evento.preventDefault()

    let nome = campoProdutoNome.value.trim()
    let categoria = campoProdutoCategoria.value
    let preco = parseFloat(campoProdutoPreco.value)
    let estoque = parseFloat(campoProdutoEstoque.value)

    if (!validarProduto(nome, categoria, preco, estoque)) {
        return
    }

    if (produtoEditandoId === null) {
        produtos.push({ id: gerarId(produtos), nome: nome, categoria: categoria, preco: preco, estoque: estoque })
        mostrarAlerta("Produto cadastrado com sucesso!", "success")
    } else {
        let produto = buscarPorId(produtos, produtoEditandoId)
        produto.nome = nome
        produto.categoria = categoria
        produto.preco = preco
        produto.estoque = estoque
        mostrarAlerta("Produto atualizado com sucesso!", "success")
    }

    salvarDados("produtos", produtos)
    sairDaEdicaoProduto()
    listarProdutos()
})

tabelaProdutos.addEventListener("click", function (evento) {
    let botao = evento.target.closest("button")
    if (botao === null) {
        return
    }

    let id = Number(botao.dataset.id)
    if (botao.dataset.acao === "editar") {
        editarProduto(id)
    } else {
        excluirProduto(id)
    }
})

buscaProduto.addEventListener("input", listarProdutos)
filtroCategoria.addEventListener("change", listarProdutos)
ordenarProdutos.addEventListener("change", listarProdutos)
btnCancelarProduto.addEventListener("click", sairDaEdicaoProduto)

listarProdutos()
