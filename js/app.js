// ===== Navegação entre as telas (seções) =====

const secoes = document.querySelectorAll(".secao")
const linksMenu = document.querySelectorAll(".link-menu")

// Mostra só a seção escolhida e esconde as outras
function mostrarSecao(id) {
    for (let secao of secoes) {
        if (secao.id === id) {
            secao.classList.remove("d-none")
        } else {
            secao.classList.add("d-none")
        }
    }

    // Destaca o link do menu da tela atual
    for (let link of linksMenu) {
        link.classList.remove("ativo")
    }
    document.getElementById("menu-" + id).classList.add("ativo")

    // Atualiza a tela que está abrindo (os dados podem ter mudado em outra tela)
    if (id === "dashboard") {
        atualizarDashboard()
    }
    if (id === "novo-pedido") {
        atualizarSelects()
    }
    if (id === "pedidos") {
        listarPedidos()
    }
}

// Ao abrir a página, começa pelo dashboard
mostrarSecao("dashboard")
