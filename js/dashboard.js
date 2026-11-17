// ===== Dashboard: indicadores calculados a partir dos dados (R10) =====

const indTotalVendido = document.getElementById("indTotalVendido")
const indPendentes = document.getElementById("indPendentes")
const indTicketMedio = document.getElementById("indTicketMedio")
const indEstoqueBaixo = document.getElementById("indEstoqueBaixo")
const indMaisVendido = document.getElementById("indMaisVendido")   // 5º card (opcional)

function atualizarDashboard() {
    // Lê os dados salvos no localStorage (sempre atualizados)
    let listaPedidos = lerDados("pedidos")
    let listaProdutos = lerDados("produtos")

    let totalVendido = 0
    let qtdEntregues = 0
    let qtdPendentes = 0
    let vendidosPorProduto = {}   // exemplo: { "X-Burger": 3, "Coca": 2 }

    // Percorre todos os pedidos uma vez só
    for (let pedido of listaPedidos) {
        if (pedido.status === "entregue") {
            totalVendido += pedido.total
            qtdEntregues++

            // Soma quantas unidades de cada produto foram entregues
            for (let item of pedido.itens) {
                if (vendidosPorProduto[item.nome] === undefined) {
                    vendidosPorProduto[item.nome] = 0
                }
                vendidosPorProduto[item.nome] += item.quantidade
            }
        } else if (pedido.status === "pendente") {
            qtdPendentes++
        }
    }

    // Ticket médio = total vendido / número de pedidos entregues
    let ticketMedio = 0
    if (qtdEntregues > 0) {
        ticketMedio = totalVendido / qtdEntregues
    }

    // Produtos com estoque baixo (limite definido em storage.js)
    let qtdEstoqueBaixo = 0
    for (let produto of listaProdutos) {
        if (produto.estoque <= LIMITE_ESTOQUE_BAIXO) {
            qtdEstoqueBaixo++
        }
    }

    // Escreve os 4 indicadores obrigatórios na tela
    indTotalVendido.textContent = formatarMoeda(totalVendido)
    indPendentes.textContent = qtdPendentes
    indTicketMedio.textContent = formatarMoeda(ticketMedio)
    indEstoqueBaixo.textContent = qtdEstoqueBaixo

    // 5º indicador: produto mais vendido (só se o card existir no HTML)
    if (indMaisVendido !== null) {
        let nomeMaisVendido = ""
        let maiorQuantidade = 0

        for (let nome in vendidosPorProduto) {
            if (vendidosPorProduto[nome] > maiorQuantidade) {
                maiorQuantidade = vendidosPorProduto[nome]
                nomeMaisVendido = nome
            }
        }

        if (nomeMaisVendido === "") {
            indMaisVendido.textContent = "-"
        } else {
            indMaisVendido.textContent = nomeMaisVendido + " (" + maiorQuantidade + " un.)"
        }
    }
}

// Ao clicar em qualquer link do menu, recalcula (os dados podem ter mudado)
for (let link of document.querySelectorAll(".link-menu")) {
    link.addEventListener("click", atualizarDashboard)
}

// Calcula também ao abrir a página
atualizarDashboard()