// ===== Funções de dados (localStorage) =====
// O localStorage só guarda texto, então usamos JSON para converter.

// Se o estoque for menor ou igual a esse valor, o produto é de "estoque baixo"
const LIMITE_ESTOQUE_BAIXO = 5

// Lê uma lista salva (ex.: "clientes"). Se não existir, devolve lista vazia.
function lerDados(chave) {
    let texto = localStorage.getItem(chave)

    if (texto === null) {
        return []
    }
    return JSON.parse(texto)
}

// Salva a lista inteira no localStorage
function salvarDados(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista))
}

// Cria um id novo: o maior id da lista + 1
function gerarId(lista) {
    let maior = 0

    for (let item of lista) {
        if (item.id > maior) {
            maior = item.id
        }
    }
    return maior + 1
}

// Procura um item da lista pelo id
function buscarPorId(lista, id) {
    for (let item of lista) {
        if (item.id === id) {
            return item
        }
    }
    return null
}

// Transforma 12.5 em "R$ 12,50"
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
