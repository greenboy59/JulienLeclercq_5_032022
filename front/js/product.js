'use strict';

// Récupération de l'id sur le produit séléctionné en page d'accueil via params
let params = new URL (document.location).searchParams;
let id = params.get('id');

// Affichage du produit séléctionné en amont sur la page d'accueil
function displayProduct () {
        fetch(`http://localhost:3000/api/products/${id}`)
        .then(response => response.json())
        .then(product => {
                document.querySelector('.item__img').innerHTML =
                    `<img src="${product.imageUrl}"
                          alt="${product.altTxt}">`
                document.querySelector('#title').innerHTML =
                    `<h1>
                    ${product.name}
                    </h1>`
                document.querySelector('#price').innerHTML =
                    `<p>
                    ${product.price}
                    </p>`
                document.querySelector('#description').innerHTML =
                    `<p>
                     ${product.description}
                    </p>`
    })
            // Message d'erreur en das de problème
            .catch(function(err) {
                console.error('erreur de chargement des données')
            })
};
displayProduct();

// Création des fonctionnalités de séléction de la couleur

// Récupération des infos de couleurs disponibles selon l'id du produit
function itemContentSettings () {
        fetch(`http://localhost:3000/api/products/${id}`)
        .then(response => response.json())
        .then(product => {
            // Création des options de couleurs dans le DOM
            product.colors.forEach((colors) => {
                const selectColorInput = document.createElement('option');
                let contentOfInput = document.createTextNode(`${colors}`);
                let colorSelectId = document.getElementById('colors');

                selectColorInput.appendChild(contentOfInput);
                selectColorInput.setAttribute('value', `${colors}`)
                selectColorInput.setAttribute('id', `${colors}`);

                colorSelectId.appendChild(selectColorInput)
            });
})
            // Message d'erreur en das de problème
            .catch(function(err) {
                console.error('erreur de chargement des données')
            });
}
itemContentSettings();

// Création d'un tableau qui va stocker les valeurs choisies par l'utilisateur
let cartArray = []
function createCartArray () {
    // Récupération des informations saisies par l'utilisateur
    document
        .getElementById('colors')
        .addEventListener('change', function colorSelectedByUser() {

            let colorSetting = event.target.value
            cartArray.push(colorSetting)
        })
    document
        .getElementById('quantity')
        .addEventListener('change', function quantitySelectedByUser() {

            let quantity = event.target.value
            cartArray.push(quantity)
        })
}

createCartArray();

// création du tableau au clic sur le bouton ajouter au panier

    document
        .getElementById(addToCart)
        addEventListener('click', function addToCart() {
            let addToCartArray = [id +','+ [cartArray]]
            localStorage.setItem('cartItems', addToCartArray)
            console.log(addToCartArray)
});


