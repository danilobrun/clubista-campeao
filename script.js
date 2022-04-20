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
     fetch('http://127.0.0.1:5501/products.json') //url, {} array de config
     .then(response => response.json()) //.then (parametro => paramentro.json() converter o obj em JSON)
     .then(body => {
         const groupsRootEl = document.querySelector('#groups-root')
         groupsRootEl.innerHTML = '' //inseri uma string vazia
         body.groups.forEach((group) => { //agora recebe um parâmetro (que guardará nosso obj JSON)
            let groupHtml = `<section><h2>${group.name}</h2><div class="products-grid">` //criamos uma let para guardar os valores da nossa antiga estrutura HTML e não fechamos a div,section vamos deixar para fechar depois
             group.products.forEach((product) => { //acessando array de produtos e lendo cada item do array
                groupHtml += `<article class="card">
                <img src="${product.image}" alt="${product.name}" width="196" height="120"/>
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p class="price">R$ ${product.price}</p>
                    <p>${product.description}</p>
                    <button class="btn btn-main btn-block">Comprar</button>
                </div>
            </article>`
            })
            groupHtml += '</div></section>' //groupHtml recebe ele mesmo + o fechamento da div, section agora nossa variavel groupHTML está com o blobo de estrutura HTML correto.
            groupsRootEl.innerHTML += groupHtml //groupsRootEl recebe valor do groupHtml e utilizada o metodo inner para renderizar no html
         });
     })
 }
 fetchProducts() //execFunction 

