'use strict'

// Déclaration des variables
const cartItemsElement = document.querySelector('#cart__items')

const cart = JSON.parse(localStorage.getItem('cart'))

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

// Récupération des données de l'API
fetch(`http://localhost:3000/api/products`)
  .then(response => response.json())
  .then(products => displayCart(products))
  .catch(err => console.error(err))