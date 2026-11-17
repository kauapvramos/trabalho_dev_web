// ===== Alerta e modal de exclusão =====

// Mostra uma mensagem (tipo: success, danger ou warning) e apaga depois de 3 segundos
function mostrarAlerta(mensagem, tipo) {
    let area = document.getElementById("alertas")

    area.innerHTML = '<div class="alert alert-' + tipo + '">' + mensagem + '</div>'

    setTimeout(function () {
        area.innerHTML = ""
    }, 3000)
}

// O botão "Excluir" de cada tabela guarda aqui o que vai ser excluído
// (o modal abre sozinho pelo data-bs-toggle do botão)
let tipoExcluir = ""
let idExcluir = 0

// Botão "Excluir" do modal: chama a exclusão certa
function confirmarExclusao() {
    if (tipoExcluir === "cliente") {
        excluirCliente(idExcluir)
    } else if (tipoExcluir === "produto") {
        excluirProduto(idExcluir)
    } else if (tipoExcluir === "pedido") {
        excluirPedido(idExcluir)
    }
}
