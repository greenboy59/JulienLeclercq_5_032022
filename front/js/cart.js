'use strict'

// Déclaration des variables
const cartItemsElement = document.querySelector('#cart__items');
const totalPriceElement = document.querySelector('#totalPrice');
const totalQuantityElement = document.querySelector('#totalQuantity');
const quantitySelectElement = document.getElementsByName('itemQuantity');

const cart = JSON.parse(localStorage.getItem('cart'));
const url = `http://localhost:3000/api/products`;
const saveToLocalStorage = localStorage.setItem('cart', JSON.stringify(cart));

// Injection dans le DOM
function displayCart(products) {
  cart.forEach((item) => {
    const product = products.find(product => item.id === product._id)
    cartItemsElement.innerHTML +=
      `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="Photographie d'un canapé">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${item.color}</p>
              <p>${product.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <label>Qté:</label>
              <p> </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
  })
}

function cartSum() {
  // Récupération des données de l'API 
  fetch(url)
    .then((products) => products.json())
    .then(function (products) {
      // Itération dans le panier
      cart.forEach((item) => {
        // On tri les produits de l'API via les données du panier
        const product = products.find((product) => item.id === product._id);

        // Calcul du total quantity et total price
        const totalQuantity = Object.values(cart).reduce((itemQuantity, { quantity }) => itemQuantity + Number(quantity), 0,);
        const totalPrice = product.price * totalQuantity

        // Insertion dans le DOM des totaux
        totalQuantityElement.innerHTML = `${totalQuantity}`;
        totalPriceElement.innerHTML = `${totalPrice}`;

        // Si l'utilisateur modifie les quantités, cela modifie les totaux
        function newQuantity (cart){
          quantitySelectElement.forEach(input => input.addEventListener('input', function (event) {
            console.log(event.target.value);
            item.splice(2, event.target.value);
            console.log(cart)
          }));
        } newQuantity();
      });
    });
}
cartSum();

// Récupération des données de l'API
fetch(url)
  .then(response => response.json())
  .then(products => displayCart(products))
  .catch(err => console.error(err))
