// ===== CRUD de clientes =====

let clientes = lerDados("clientes")
let clienteEditandoId = 0   // 0 = cadastrando; outro número = editando esse cliente

const formCliente = document.getElementById("formCliente")
const campoClienteNome = document.getElementById("clienteNome")
const campoClienteTelefone = document.getElementById("clienteTelefone")
const campoClienteEndereco = document.getElementById("clienteEndereco")
const tabelaClientes = document.getElementById("tabelaClientes")
const buscaCliente = document.getElementById("buscaCliente")
const btnCancelarCliente = document.getElementById("btnCancelarCliente")


function listarClientes() {
    let busca = buscaCliente.value.toLowerCase()
    let html = ""

    for (let cliente of clientes) {
        let texto = (cliente.nome + " " + cliente.telefone).toLowerCase()

        if (texto.includes(busca)) {
            html += "<tr>"
            html += "<td>" + cliente.nome + "</td>"
            html += "<td>" + cliente.telefone + "</td>"
            html += "<td>" + cliente.endereco + "</td>"
            html += '<td class="text-end">'
            html += '<button class="btn btn-sm btn-outline-dark" onclick="editarCliente(' + cliente.id + ')">Editar</button> '
            html += '<button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modalExcluir" onclick="pedirExclusaoCliente(' + cliente.id + ')">Excluir</button>'
            html += "</td>"
            html += "</tr>"
        }
    }

    if (html === "") {
        html = '<tr><td colspan="4" class="text-muted">Nenhum cliente encontrado.</td></tr>'
    }
    tabelaClientes.innerHTML = html
}

// Volta o formulário para o modo "cadastrar"
function limparFormCliente() {
    clienteEditandoId = 0
    formCliente.reset()
    document.getElementById("tituloFormCliente").textContent = "Cadastrar cliente"
    btnCancelarCliente.classList.add("d-none")
}


function editarCliente(id) {
    let cliente = buscarPorId(clientes, id)

    clienteEditandoId = id
    campoClienteNome.value = cliente.nome
    campoClienteTelefone.value = cliente.telefone
    campoClienteEndereco.value = cliente.endereco

    document.getElementById("tituloFormCliente").textContent = "Editar cliente"
    btnCancelarCliente.classList.remove("d-none")
}


function pedirExclusaoCliente(id) {
    tipoExcluir = "cliente"
    idExcluir = id
}

// Chamada quando o usuário confirma no modal
function excluirCliente(id) {
    // Regra: cliente que já tem pedido não pode ser excluído
    for (let pedido of lerDados("pedidos")) {
        if (pedido.clienteId === id) {
            mostrarAlerta("Não é possível excluir: este cliente já tem pedidos.", "danger")
            return
        }
    }

    // Cria uma lista nova sem o cliente excluído
    let novaLista = []
    for (let cliente of clientes) {
        if (cliente.id !== id) {
            novaLista.push(cliente)
        }
    }
    clientes = novaLista

    salvarDados("clientes", clientes)
    listarClientes()
    mostrarAlerta("Cliente excluído.", "success")
}

// Botão "Salvar cliente"
formCliente.addEventListener("submit", function (evento) {
    evento.preventDefault()  

    let nome = campoClienteNome.value.trim()
    let telefone = campoClienteTelefone.value.trim()
    let endereco = campoClienteEndereco.value.trim()

  
    if (nome.length < 3) {
        mostrarAlerta("Informe o nome com pelo menos 3 letras.", "danger")
        return
    }
    if (telefone.length < 10) {
        mostrarAlerta("Informe o telefone com DDD, ex.: (47) 90000-0000.", "danger")
        return
    }

    if (clienteEditandoId === 0) {
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
    limparFormCliente()
    listarClientes()
})

buscaCliente.addEventListener("input", listarClientes)
btnCancelarCliente.addEventListener("click", limparFormCliente)

listarClientes()
