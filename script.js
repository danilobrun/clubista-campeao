function openSidebar () {
    var cartSidebar = document.querySelector('.cart-sidebar') /*Seleciona .cart-sidebar*/
    cartSidebar.classList.add('cart-sidebar-open') /*na lista de classes do cartSidebar add uma nova classe definida em nosso CSS*/
}
function closeSidebar () {
    var cartSidebar = document.querySelector('.cart-sidebar') /*Seleciona meu cart-sidebar*/
    cartSidebar.classList.remove('cart-sidebar-open') /*removemos a classe que faz o cart abrir*/
}
const btnCart = document.querySelector('#btn-cart') /*Selecionando o elemento sacola*/
btnCart.addEventListener('click', openSidebar) /*(evento, ação)*/
const btnCloseCart = document.querySelector('#btn-close-cart') /*Elemento fechar sacola*/
btnCloseCart.addEventListener('click', closeSidebar) /*evento click, fechar carrinho*/
const addMore = document.querySelector('#add-more') /*Elemento btn-outline*/
addMore.addEventListener('click', closeSidebar) /*evenco click, fechar sidebar*/
