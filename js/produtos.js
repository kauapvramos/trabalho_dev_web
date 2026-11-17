

let produtos = lerDados("produtos")
let produtoEditandoId = 0   // 0 = cadastrando

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

// Busca + filtro de categoria + ordenação, depois desenha a tabela
function listarProdutos() {
    let busca = buscaProduto.value.toLowerCase()
    let categoria = filtroCategoria.value
    let lista = []

    for (let produto of produtos) {
        let achouNome = produto.nome.toLowerCase().includes(busca)
        let achouCategoria = categoria === "" || produto.categoria === categoria

        if (achouNome && achouCategoria) {
            lista.push(produto)
        }
    }

    // Ordenação: o sort compara dois produtos (a e b) de cada vez
    let ordem = ordenarProdutos.value
    lista.sort(function (a, b) {
        if (ordem === "preco-asc") {
            return a.preco - b.preco
        }
        if (ordem === "preco-desc") {
            return b.preco - a.preco
        }
        if (ordem === "estoque-asc") {
            return a.estoque - b.estoque
        }
        return a.nome.localeCompare(b.nome)
    })

    let html = ""
    for (let produto of lista) {
        let aviso = ""
        if (produto.estoque <= LIMITE_ESTOQUE_BAIXO) {
            aviso = ' <span class="badge text-bg-danger">Estoque baixo</span>'
        }

        html += "<tr>"
        html += "<td>" + produto.nome + "</td>"
        html += "<td>" + produto.categoria + "</td>"
        html += "<td>" + formatarMoeda(produto.preco) + "</td>"
        html += "<td>" + produto.estoque + aviso + "</td>"
        html += '<td class="text-end">'
        html += '<button class="btn btn-sm btn-outline-dark" onclick="editarProduto(' + produto.id + ')">Editar</button> '
        html += '<button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalExcluir" onclick="pedirExclusaoProduto(' + produto.id + ')">Excluir</button>'
        html += "</td>"
        html += "</tr>"
    }

    if (html === "") {
        html = '<tr><td colspan="5" class="text-muted">Nenhum produto encontrado.</td></tr>'
    }
    tabelaProdutos.innerHTML = html
}

function limparFormProduto() {
    produtoEditandoId = 0
    formProduto.reset()
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
}

function pedirExclusaoProduto(id) {
    tipoExcluir = "produto"
    idExcluir = id
}

function excluirProduto(id) {
    // Regra: produto que já está em algum pedido não pode ser excluído
    for (let pedido of lerDados("pedidos")) {
        for (let item of pedido.itens) {
            if (item.produtoId === id) {
                mostrarAlerta("Não é possível excluir: este produto já está em pedidos.", "danger")
                return
            }
        }
    }

    let novaLista = []
    for (let produto of produtos) {
        if (produto.id !== id) {
            novaLista.push(produto)
        }
    }
    produtos = novaLista

    salvarDados("produtos", produtos)
    listarProdutos()
    mostrarAlerta("Produto excluído.", "success")
}

formProduto.addEventListener("submit", function (evento) {
    evento.preventDefault()

    let nome = campoProdutoNome.value.trim()
    let categoria = campoProdutoCategoria.value
    let preco = parseFloat(campoProdutoPreco.value)
    let estoque = parseInt(campoProdutoEstoque.value)

    // Validações
    if (nome.length < 2) {
        mostrarAlerta("Informe o nome do produto.", "danger")
        return
    }
    if (categoria === "") {
        mostrarAlerta("Escolha uma categoria.", "danger")
        return
    }
    if (isNaN(preco) || preco <= 0) {
        mostrarAlerta("O preço deve ser maior que zero.", "danger")
        return
    }
    if (isNaN(estoque) || estoque < 0) {
        mostrarAlerta("O estoque deve ser um número de 0 para cima.", "danger")
        return
    }

    if (produtoEditandoId === 0) {
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
    limparFormProduto()
    listarProdutos()
})

buscaProduto.addEventListener("input", listarProdutos)
filtroCategoria.addEventListener("change", listarProdutos)
ordenarProdutos.addEventListener("change", listarProdutos)
btnCancelarProduto.addEventListener("click", limparFormProduto)

listarProdutos()
