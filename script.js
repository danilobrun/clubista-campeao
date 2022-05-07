/*
* Open/Close cart sidebar
*/
const cartSidebar = document.querySelector('.cart-sidebar') /*Seleciona .cart-sidebar*/
function openSidebar (event) { //Abrir carrinho
    event.stopPropagation() //Para de propagar o evento para os elementos pai
    cartSidebar.classList.add('cart-sidebar-open') /*na lista de classes do cartSidebar add uma nova classe definida em nosso CSS*/

}
function closeSidebar () {
    cartSidebar.classList.remove('cart-sidebar-open') /*removemos a classe que faz o cart abrir*/
}
const btnCart = document.querySelector('#btn-cart') /*Selecionando o elemento sacola*/
btnCart.addEventListener('click', openSidebar) /*(evento, ação) openSidebar nesse caso é una função de callBack*/
const btnCloseCart = document.querySelector('#btn-close-cart') /*Elemento fechar sacola*/
btnCloseCart.addEventListener('click', closeSidebar) /*evento click, fechar carrinho função de callBack*/
const addMore = document.querySelector('#add-more') /*Elemento btn-outline*/
addMore.addEventListener('click', closeSidebar) /*evenco click, fechar sidebar*/
document.addEventListener('click', closeSidebar) //evento de click, no body para fechar o sidebar de carrinho
cartSidebar.addEventListener('click', event => event.stopPropagation()) //aside do carrinho para propagação do evento

/*
* Fetch Products
*/ 
const groupsRootEl = document.querySelector('#groups-root')
const fetchProducts = () => { /*arrow function*/
    fetch('/products.json') //url, {} array de config
    .then(response => response.json()) //.then (parametro => paramentro.json() converter o obj em JSON)
    .then(body => {
        groupsRootEl.innerHTML = '' //inseri uma string vazia
        body.groups.forEach((group) => { //agora recebe um parâmetro (que guardará nosso obj JSON)
        let groupHtml = `<section><h2>${group.name}</h2><div class="products-grid">` //criamos uma let para guardar os valores da nossa antiga estrutura HTML e não fechamos a div,section vamos deixar para fechar depois
            group.products.forEach((product) => { //acessando array de produtos e lendo cada item do array
            const description = product.description != null ? `<p>${product.description}</p>` : '' //Operador ternario
            groupHtml += `<article class="card">
            <img src="${product.image}" alt="${product.name}" width="196" height="120"/>
            <div class="card-content">
                <h3>${product.name}</h3>
                <p class="price">R$ ${product.price.toLocaleString('pt-br', {minimumFractionDigits: 2})}</p>
                ${description}
                <button class="btn btn-main btn-block btn-add-cart" 
                data-id="${product.id}"
                data-name="${product.name}"
                data-image="${product.image}"
                data-price="${product.price}" 
                >Comprar</button>
            </div>
        </article>`
        })
        groupHtml += '</div></section>' //groupHtml recebe ele mesmo + o fechamento da div, section agora nossa variavel groupHTML está com o blobo de estrutura HTML correto.
        groupsRootEl.innerHTML += groupHtml //groupsRootEl recebe valor do groupHtml e utilizada o metodo inner para renderizar no html
        })
        setupAddToCart()
    })
    .catch((err) => {
    console.log(err);
    groupsRootEl.innerHTML = `<p class="alert-error">Falha ao carregar produtos. Recarregue a página.</p>`
    })
}
if (groupsRootEl) {
    fetchProducts()
}
 

 /*
 * Products Cart
 */
let productsCart = [] //array vazio para adicionar os produtos
const addToCart = (event) => { //função para adicionar no carrinho, checa se o produto já esta no carrinho caso não add e + 1 em qty
    const product = event.target.dataset //no inspecionar não trás ID
    const index = productsCart.findIndex((item) => item.id == product.id)
    if (index == -1) {
        productsCart.push({
            ...product, //adiciona ele mesmo product++
            price: Number(product.price), //converte o price de string para número
            qty: 1
        })
    } else {
        productsCart[index].qty++ //add ele mesmo no caso +1
    }
    handleCartUpdate() //Sempre depois de add no carrinho chama essa função para renderizar em tela
}
function removeOfCart () { //Remoção cria uma copia do array mesmo aquele ID que queremos excluir
    const { id } = this.dataset //modelo de destruturação pegar o ID dentro do dataset.id
    productsCart = productsCart.filter((product) => product.id != id)
    handleCartUpdate() //Chama o mesmo cara para atualizar os efeitos colaterais
}

  
/*Funcao setupaddTocart*/
const setupAddToCart = () => { //Adicionado essa funcao após o then (entrega da promessa)
    const btnAddCartEls = document.querySelectorAll('.btn-add-cart') //seleciona os elementos pela classe
    btnAddCartEls.forEach(btn => { //percorre o array btnAddCartEls, parâmetro btn função de callback 
        btn.addEventListener('click', addToCart) //adiciona o evento de click, guarda o evento em addToCart
    })
}
/*Funca lidar com Keydown User input*/
const handleKeydown = event => { //função para impedir caracteres indevidos
    if (event.key == '-' || event.key == '.') { //seleciona event.key é o valor
        event.preventDefault() //impede o comportamento padrão de permitir no input os valores
    }
}
const handleUpdateQty = (event) => {
    const { id } = event.target.dataset //id recebe product.id
    const qty = parseInt(event.target.value) //função para converter string em Int
    if (qty > 0) {
        const index = productsCart.findIndex(item => item.id == id) //Itera sobre o array para achar seu index
        productsCart[index].qty = qty //adiciona qty do input no qty do produto
        handleCartUpdate(false) //executa o atualização do carrinho
    } else {
        productsCart = productsCart.filter((product) => product.id != id) //Se o produto for diferente retorna true inclui produto no carrinho, caso não returna false exclui produto do carrinho
        handleCartUpdate() //Renderiza e exclui o item
    }
     
}
const setupCartEvents = () => { //Evento d o carrinho
    const btnRemoveCartEls = document.querySelectorAll('.btn-remove-cart') //Captura botao através da classe
    btnRemoveCartEls.forEach((btn) => { //Itera sobre o array de inputs com parâmetro btn para usar depois na função
        btn.addEventListener('click', removeOfCart) //adiciona evento escuta do click, executa função removeOfCart
    })
    const inputsQtyEl = document.querySelectorAll('.input-qty-cart') //Catpura input através da classe
    inputsQtyEl.forEach((input) => { //Itera o array e executa uma função passando um parâmetro input 
        input.addEventListener('keydown', handleKeydown)
        input.addEventListener('keyup', handleUpdateQty)
        input.addEventListener('change', handleUpdateQty)
    })   
}
const keyCart = '@torcedor/productsCart' //chaveLocalStorage
const handleCartUpdate = (renderItens = true) => { //Rederização do carrinho por padrão é true ou seja na hora de chamar ele não preciso dizer se ele é true
    localStorage.setItem(keyCart, JSON.stringify(productsCart)) //setar item no carrinho
    const badgeEl = document.querySelector('#btn-cart .badge') //seleciona o elemento no DOM como ID e seleciona seu elemento filho que contenha o a classe .badge
    const emptyCartEl = document.querySelector('#empty-cart') //Seleciona o elemento com esse ID
    const cartWithProductsEl = document.querySelector('#cart-with-products')
    const cartItensParent = cartWithProductsEl.querySelector('ul') // seleciona o elemento ul de dentro do #cart-with-products
    const cartTotalValueEl = document.querySelector('#cart-total-value')
    const totalCart = productsCart.reduce((total, item) => total + item.qty, 0) 
    if (totalCart > 0) { //Lógica caso totalCart > 0 (tem algum item no carro) mostre os produtos
        badgeEl.classList.add('badge-show') //Executa a variavel com os metodos classlist.add para adicionar uma nova classe ao elemento
        badgeEl.innerText = totalCart //O texto do elemento recebe o tamanho do array
        cartWithProductsEl.classList.add('cart-with-products-show')
        emptyCartEl.classList.remove('empty-cart-show') //remove a msg de carrinho vazio
        if (renderItens) { //se renderItens=True
            cartItensParent.innerHTML = '' //String vazia
            productsCart.forEach((product) => { //iterar sobre o array, abaixo add ele mesmo string vazia e depois recebe a template string
                cartItensParent.innerHTML += `<li class="cart-item">
                <img src="${product.image}" alt="${product.name}" width="70" height="70"/>
                <div>
                    <p class="h3">${product.name}</p>
                    <p class="price">R$ ${product.price.toLocaleString('pt-br', {minimumFractionDigits: 2})}</p>
                </div>
                <input class="form-input input-qty-cart" type="number" min="0" value="${product.qty}" data-id="${product.id}">
                <button class="btn-remove-cart" data-id="${product.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>       
            </li>`
            })
            setupCartEvents()
        }
        const totalPrice = productsCart.reduce((total, item) => { //somar o valor total R$
            return total + (item.qty * item.price)
        }, 0)
        cartTotalValueEl.innerText = 'R$ ' + totalPrice.toLocaleString('pt-br', {minimumFractionDigits: 2})
    } else { //Caso não mostre o carrinho vázio
        badgeEl.classList.remove('badge-show') //Renderizar remover
        emptyCartEl.classList.add('empty-cart-show')
        cartWithProductsEl.classList.remove('cart-with-products-show')
    }
}

const initCart = () => {
    const savedProducts = localStorage.getItem(keyCart) //pegando itens do local storage key: productsCart e guardando em uma var
    if (savedProducts) { //se savedProducts for true ( != null )
        productsCart = JSON.parse(savedProducts) //convertendo em JSON array
    }
    handleCartUpdate() //executa a renderização
}
initCart() //executa a função

/* Form checkout */
const handleCheckoutSubmit = event => { /*função simples para interromper o evento do submit*/
    event.preventDefault() /*recebe um parâmetro event.execFuction*/
    if (productsCart.length == 0) {
        alert('Nenhum produto no carrinho.')
        return /*Caso a condição seja verdadeira para por aqui não avança*/
    }
    let text = "Confira o pedido\n-------------------------\n\n"
    productsCart.forEach((product) => {
        text += `*${product.qty}x ${product.name}* - R$ ${product.price.toLocaleString('pt-br', {minimumFractionDigits: 2})}\n`
    })
    const totalPrice = productsCart.reduce((total, item) => { //somar o valor total R$
        return total + (item.qty * item.price)
    }, 0)
    text += `\n*Taxa de entrega:* A combinar\n*Total: R$ ${totalPrice.toLocaleString('pt-br', {minimumFractionDigits: 2})}*`
    text += `\n\n-------------------------\n\n`
    text += `*${event.target.elements['input-name'].value}*`
    text += `\n${event.target.elements['input-phone'].value}\n\n`
    const complement = event.target.elements['input-complement'].value ? `- ${event.target.elements['input-complement'].value}` : ''
    text += `${event.target.elements['input-address'].value}, ${event.target.elements['input-number'].value}${complement}\n`
    text += `${event.target.elements['input-neighborhood'].value}, ${event.target.elements['input-city'].value}\n`
    text += event.target.elements['input-cep'].value
    console.log(text);
    text = encodeURI(text)
    const subdomain = window.innerWidth > 768 ? 'web' : 'api'
    window.open(`https://${subdomain}.whatsapp.com/send?phone=5581979139104&text=${text}`, '_blank')
}
const formCheckoutEl = document.querySelector('.form-checkout') /*Captura El formulário*/
formCheckoutEl?.addEventListener('submit', handleCheckoutSubmit) /*Adiciona uma esconta ao EL do tipo submit e executa a função interromper o submit*/

/* Masks */
const inputPhoneEl = document.querySelector('#input-phone')
IMask(inputPhoneEl, { /*Executa a função IMask(como parâmetro passamos nosso elemento) */
    mask: '(00) 00000-0000' // formato da máscara pattern
})
const inputCepEl = document.querySelector('#input-cep')
IMask(inputCepEl, {
    mask: '00000-000'
});