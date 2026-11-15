// ===== Funções de interface (alertas, erros nos campos e modal) =====

// Evita que texto digitado pelo usuário vire HTML dentro da tabela
function escapar(texto) {
    let div = document.createElement("div")
    div.textContent = texto
    return div.innerHTML
}

// Mostra um alerta do Bootstrap que some sozinho (tipo: success, danger, warning)
function mostrarAlerta(mensagem, tipo) {
    let area = document.getElementById("alertas")

    let alerta = document.createElement("div")
    alerta.className = "alert alert-" + tipo + " alert-dismissible fade show"

    let texto = document.createElement("span")
    texto.textContent = mensagem

    let fechar = document.createElement("button")
    fechar.type = "button"
    fechar.className = "btn-close"
    fechar.setAttribute("data-bs-dismiss", "alert")

    alerta.appendChild(texto)
    alerta.appendChild(fechar)
    area.appendChild(alerta)

    setTimeout(function () {
        alerta.remove()
    }, 3500)
}

// Marca o campo como inválido e escreve a mensagem logo abaixo dele
function marcarErro(campo, mensagem) {
    campo.classList.add("is-invalid")
    campo.nextElementSibling.textContent = mensagem
}

// Tira todas as marcações de erro de um formulário
function limparErros(formulario) {
    let campos = formulario.querySelectorAll(".is-invalid")

    for (let campo of campos) {
        campo.classList.remove("is-invalid")
    }
}

// ----- Modal de confirmação de exclusão -----
let acaoExclusao = null

function confirmarExclusao(mensagem, aoConfirmar) {
    document.getElementById("modalExcluirTexto").textContent = mensagem
    acaoExclusao = aoConfirmar

    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalExcluir"))
    modal.show()
}

document.getElementById("btnConfirmarExclusao").addEventListener("click", function () {
    if (acaoExclusao !== null) {
        acaoExclusao()
    }
    acaoExclusao = null

    bootstrap.Modal.getInstance(document.getElementById("modalExcluir")).hide()
})
