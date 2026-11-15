// ===== CRUD de clientes =====

let clientes = lerDados("clientes")
let clienteEditandoId = null   // null = cadastrando; número = editando esse cliente

const formCliente = document.getElementById("formCliente")
const campoClienteNome = document.getElementById("clienteNome")
const campoClienteTelefone = document.getElementById("clienteTelefone")
const campoClienteEndereco = document.getElementById("clienteEndereco")
const tabelaClientes = document.getElementById("tabelaClientes")
const buscaCliente = document.getElementById("buscaCliente")
const btnCancelarCliente = document.getElementById("btnCancelarCliente")

// Valida os campos. Devolve true se estiver tudo certo.
function validarCliente(nome, telefone) {
    let valido = true
    limparErros(formCliente)

    if (nome.length < 3) {
        marcarErro(campoClienteNome, "Informe o nome com pelo menos 3 letras.")
        valido = false
    }

    // Tira tudo que não é número e confere se tem DDD + telefone (10 ou 11 dígitos)
    let digitos = telefone.replace(/\D/g, "")
    if (digitos.length < 10 || digitos.length > 11) {
        marcarErro(campoClienteTelefone, "Telefone inválido. Use DDD + número, ex.: (47) 90000-0000.")
        valido = false
    }

    return valido
}

// Verifica se o cliente já fez algum pedido (regra de negócio da exclusão)
function clienteTemPedidos(id) {
    let pedidos = lerDados("pedidos")

    for (let pedido of pedidos) {
        if (pedido.clienteId === id) {
            return true
        }
    }
    return false
}

// Desenha a tabela de clientes (já aplicando a busca)
function listarClientes() {
    let termo = buscaCliente.value.trim().toLowerCase()
    let html = ""

    for (let cliente of clientes) {
        let texto = (cliente.nome + " " + cliente.telefone).toLowerCase()

        if (texto.includes(termo)) {
            html += `
                <tr>
                    <td>${escapar(cliente.nome)}</td>
                    <td>${escapar(cliente.telefone)}</td>
                    <td>${escapar(cliente.endereco)}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-dark" data-acao="editar" data-id="${cliente.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${cliente.id}">Excluir</button>
                    </td>
                </tr>`
        }
    }

    if (html === "") {
        html = `<tr><td colspan="4" class="text-muted">Nenhum cliente encontrado.</td></tr>`
    }
    tabelaClientes.innerHTML = html
}

// Volta o formulário para o modo "cadastrar"
function sairDaEdicaoCliente() {
    clienteEditandoId = null
    formCliente.reset()
    limparErros(formCliente)
    document.getElementById("tituloFormCliente").textContent = "Cadastrar cliente"
    btnCancelarCliente.classList.add("d-none")
}

// Preenche o formulário com os dados do cliente escolhido
function editarCliente(id) {
    let cliente = buscarPorId(clientes, id)

    clienteEditandoId = id
    campoClienteNome.value = cliente.nome
    campoClienteTelefone.value = cliente.telefone
    campoClienteEndereco.value = cliente.endereco

    document.getElementById("tituloFormCliente").textContent = "Editar cliente"
    btnCancelarCliente.classList.remove("d-none")
    campoClienteNome.focus()
}

function excluirCliente(id) {
    let cliente = buscarPorId(clientes, id)

    if (clienteTemPedidos(id)) {
        mostrarAlerta("Não é possível excluir: este cliente já tem pedidos.", "danger")
        return
    }

    confirmarExclusao("Deseja excluir o cliente " + cliente.nome + "?", function () {
        clientes = clientes.filter(function (c) {
            return c.id !== id
        })
        salvarDados("clientes", clientes)
        listarClientes()
        mostrarAlerta("Cliente excluído.", "success")
    })
}

// Salvar (cadastrar ou editar)
formCliente.addEventListener("submit", function (evento) {
    evento.preventDefault()

    let nome = campoClienteNome.value.trim()
    let telefone = campoClienteTelefone.value.trim()
    let endereco = campoClienteEndereco.value.trim()

    if (!validarCliente(nome, telefone)) {
        return
    }

    if (clienteEditandoId === null) {
        clientes.push({ id: gerarId(clientes), nome: nome, telefone: telefone, endereco: endereco })
        mostrarAlerta("Cliente cadastrado com sucesso!", "success")
    } else {
        let cliente = buscarPorId(clientes, clienteEditandoId)
        cliente.nome = nome
        cliente.telefone = telefone
        cliente.endereco = endereco
        mostrarAlerta("Cliente atualizado com sucesso!", "success")
    }

    salvarDados("clientes", clientes)
    sairDaEdicaoCliente()
    listarClientes()
})

// Cliques nos botões da tabela (um único listener para todos os botões)
tabelaClientes.addEventListener("click", function (evento) {
    let botao = evento.target.closest("button")
    if (botao === null) {
        return
    }

    let id = Number(botao.dataset.id)
    if (botao.dataset.acao === "editar") {
        editarCliente(id)
    } else {
        excluirCliente(id)
    }
})

buscaCliente.addEventListener("input", listarClientes)
btnCancelarCliente.addEventListener("click", sairDaEdicaoCliente)

listarClientes()
