"use strict";

// Déclaration des variables
const cartItemsElement = document.querySelector('#cart__items')

// Lecture des clés et objets stockées dans le local storage puis envoi vers objet 'cart'
  let produitsEnregistresDansLocalStorage = localStorage.getItem('panier');
  let cart = JSON.parse(produitsEnregistresDansLocalStorage);

// Injection dans le DOM
function displayCart(products) {
  cart.forEach((item) => {
    products.forEach((product) => {
      cartItemsElement.innerHTML +=
        `<article class="cart__item" data-id="${item.id_produit}" data-color="${item.couleur}">
          <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : ${item.quantité}</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="0">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
        </div>
    </article>`
    })
  })
}

// Récupération des données de l'API


fetch(`http://localhost:3000/api/products`)
  .then(response => response.json())
  .then(products => displayCart(products))
  .catch(err => console.error(err))
