
function mostrarAlerta(mensagem, tipo) {
    let area = document.getElementById("alertas")

    area.innerHTML = '<div class="alert alert-' + tipo + '">' + mensagem + '</div>'

    setTimeout(function () {
        area.innerHTML = ""
    }, 3000)
}



let tipoExcluir = ""
let idExcluir = 0


function confirmarExclusao() {
    if (tipoExcluir === "cliente") {
        excluirCliente(idExcluir)
    } else if (tipoExcluir === "produto") {
        excluirProduto(idExcluir)
    } else if (tipoExcluir === "pedido") {
        excluirPedido(idExcluir)
    }
}
