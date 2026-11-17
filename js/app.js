

const secoes = document.querySelectorAll(".secao")
const linksMenu = document.querySelectorAll(".link-menu")


function mostrarSecao(id) {
    for (let secao of secoes) {
        if (secao.id === id) {
            secao.classList.remove("d-none")
        } else {
            secao.classList.add("d-none")
        }
    }

    
    for (let link of linksMenu) {
        link.classList.remove("ativo")
    }
    document.getElementById("menu-" + id).classList.add("ativo")

    // Atualiza a tela que está abrindo 
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


mostrarSecao("dashboard")
