"use strict";

const itemsElement = document.getElementById('items')

function displayProducts(products) {
  
        products.forEach((product) => {

            itemsElement.insertAdjacentHTML('beforeend',
                `<a href='./product.html?id=${product._id}'>
                  <article>
                    <img src='${product.imageUrl}' alt='${product.altTxt}'>
                    <h3 class='productName'>${product.name}</h3>
                    <p class='productDescription'>${product.description}</p>
                  </article>
                </a>`
            )
        })
    }

// Récupération des données de l'API
fetch(`http://localhost:3000/api/products`)
  .then(response => response.json())
  .then(products => displayProducts(products))
  .catch(err => console.error(err))