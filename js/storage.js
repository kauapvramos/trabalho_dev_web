// ===== Dados no localStorage =====
// O localStorage só guarda texto, por isso usamos JSON para converter a lista.

// Produto com estoque menor ou igual a esse valor é "estoque baixo"
const LIMITE_ESTOQUE_BAIXO = 5

// Lê uma lista salva. Se não existir nada ainda, devolve uma lista vazia.
function lerDados(chave) {
    let texto = localStorage.getItem(chave)

    if (texto === null) {
        return []
    }
    return JSON.parse(texto)
}

// Salva a lista no localStorage
function salvarDados(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista))
}

// Novo id = maior id da lista + 1
function gerarId(lista) {
    let maior = 0

    for (let item of lista) {
        if (item.id > maior) {
            maior = item.id
        }
    }
    return maior + 1
}

// Procura um item da lista pelo id (devolve null se não achar)
function buscarPorId(lista, id) {
    for (let item of lista) {
        if (item.id === id) {
            return item
        }
    }
    return null
}

// 12.5 vira "R$ 12,50"
function formatarMoeda(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",")
}
