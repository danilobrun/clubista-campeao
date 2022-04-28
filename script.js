/*
* Open/Close cart sidebar
*/
const cartSidebar = document.querySelector('.cart-sidebar') /*Seleciona .cart-sidebar*/
function openSidebar () {
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

/*
* Fetch Products
*/ 
 const fetchProducts = () => { /*arrow function*/
     const groupsRootEl = document.querySelector('#groups-root')
     fetch('http://127.0.0.1:5501/products.json') //url, {} array de config
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
 fetchProducts() //execFunction 

 /*
 * Products Cart
 */
let productsCart = []
const addToCart = (event) => {
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
    handleCartUpdate()
}
function removeOfCart () {
    const { id } = this.dataset //modelo de destruturação pegar o ID dentro do dataset.id
    productsCart = productsCart.filter((product) => product.id != id)
    handleCartUpdate()
}

  
/*Funcao setupaddTocart*/
const setupAddToCart = () => { //Adicionado essa funcao após o then (entrega da promessa)
    const btnAddCartEls = document.querySelectorAll('.btn-add-cart') //seleciona os elementos pela classe
    btnAddCartEls.forEach(btn => { //percorre o array btnAddCartEls, parâmetro btn função de callback 
        btn.addEventListener('click', addToCart) //adiciona o evento de click, guarda o evento em addToCart
    })
}
const setupRemoveOfCart = () => {
    const btnRemoveCartEls = document.querySelectorAll('.btn-remove-cart')
    btnRemoveCartEls.forEach((btn) => {
        btn.addEventListener('click', removeOfCart)
    })
}
const handleCartUpdate = () => { //Rederização do carrinho
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
        cartItensParent.innerHTML = '' //String vazia
        productsCart.forEach((product) => { //iterar sobre o array, abaixo add ele mesmo string vazia e depois recebe a template string
            cartItensParent.innerHTML += `<li class="cart-item">
            <img src="${product.image}" alt="${product.name}" width="70" height="70"/>
            <div>
                <p class="h3">${product.name}</p>
                <p class="price">R$ ${product.price.toLocaleString('pt-br', {minimumFractionDigits: 2})}</p>
            </div>
            <input class="form-input" type="number" min="0" value="${product.qty}">
            <button class="btn-remove-cart" data-id="${product.id}">
                <i class="fas fa-trash-alt"></i>
            </button>       
        </li>`
        })
        setupRemoveOfCart()
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
handleCartUpdate()
