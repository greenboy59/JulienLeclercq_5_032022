"use strict";

const itemsElement = document.getElementById("items")

function displayProducts(products) {
        // Création d'une boucle pour itérer les valeurs du tableau de produits
        products.forEach((product) => {

            // Injection dans le DOM avec ittération
            itemsElement.innerHTML +=
                `<a href="./product.html?id=${product._id}">
                  <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                  </article>
                </a>`
        })
    }

// Récupération des données de l'API

fetch(`http://localhost:3000/api/products`)
  .then(response => response.json())
  .then(products => displayProducts(products))
  .catch(err => console.error(err))