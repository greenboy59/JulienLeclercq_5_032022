"use strict";

// Récupération des données de l'API
function getProducts() {
    fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(products => {

        // Création d'une boucle pour itérer les valeurs du tableau de produits
        products.forEach((product) => {

            // Injection dans le DOM avec ittération
            document.getElementById("items").innerHTML +=
                `<a href="./product.html?id=${product._id}">
                  <article>
                    <img src="${product.imageUrl}" 
                         alt="${product.altTxt}">
                    <h3 class="productName">
                      ${product.name}
                    </h3>
                    <p class="productDescription">
                      ${product.description}
                    </p>
                  </article>
                </a>`
        })
    })

        // Message d'erreur en das de problème
    .catch(function(err) {
        console.error("erreur de chargement des données")
    })
}

//execution de la fonction
getProducts();














