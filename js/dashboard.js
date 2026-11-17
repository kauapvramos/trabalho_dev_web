// ===== Dashboard: números calculados a partir dos dados =====

const indTotalVendido = document.getElementById("indTotalVendido")
const indPendentes = document.getElementById("indPendentes")
const indTicketMedio = document.getElementById("indTicketMedio")
const indEstoqueBaixo = document.getElementById("indEstoqueBaixo")

function atualizarDashboard() {
    let totalVendido = 0
    let qtdEntregues = 0
    let qtdPendentes = 0
    let qtdEstoqueBaixo = 0

    // Percorre os pedidos: só os entregues contam como venda
    for (let pedido of pedidos) {
        if (pedido.status === "entregue") {
            totalVendido += pedido.total
            qtdEntregues++
        }
        if (pedido.status === "pendente") {
            qtdPendentes++
        }
    }

    // Ticket médio = total vendido / quantidade de pedidos entregues
    let ticketMedio = 0
    if (qtdEntregues > 0) {
        ticketMedio = totalVendido / qtdEntregues
    }

    // Produtos com estoque baixo
    for (let produto of produtos) {
        if (produto.estoque <= LIMITE_ESTOQUE_BAIXO) {
            qtdEstoqueBaixo++
        }
    }

    indTotalVendido.textContent = formatarMoeda(totalVendido)
    indPendentes.textContent = qtdPendentes
    indTicketMedio.textContent = formatarMoeda(ticketMedio)
    indEstoqueBaixo.textContent = qtdEstoqueBaixo
}
