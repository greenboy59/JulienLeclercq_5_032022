'use strict';

// Création des variables
const image = document.querySelector('.item__img')
const title = document.querySelector('#title')
const price = document.querySelector('#price')
const description = document.querySelector('#description')
const colorSelectElement = document.querySelector('#colors')
const quantitySelectElement = document.querySelector('#quantity')
const addToCartButton = document.querySelector('#addToCart')

// Récupération de l'id sur le produit séléctionné en page d'accueil via params
const params = new URL(document.location).searchParams
const id = params.get('id')
const cart = []

// Affichage du produit séléctionné en amont sur la page d'accueil
function displayProduct(product) {
  image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    title.innerHTML = `<h1>${product.name}</h1>`
    price.innerHTML = `<p>${product.price}</p>`
    description.innerHTML = `<p>${product.description}</p>`
    product.colors.forEach((color) => colorSelectElement.innerHTML += `<option value="${color}">${color}</option>`)
}

/* Création d'une fonction avec condition if:
*en cas de séléction vide = message d'erreur
*en cas de séléction valide = ajout des items selectionnés dans un tableau panier puis tableau stocké dans local storage
 */
function addToCart() {
    addToCartButton.addEventListener('click', function () {
      if (colorSelectElement.value === "" || quantitySelectElement.value <= 0) {
        alert('Vous devez séléctionner une couleur ET une quantité')
        return;
      }
    cart.push(`id produit: ${id}`, `couleur: ${colorSelectElement.value}`, `quantité: ${quantitySelectElement.value}`)
    localStorage.setItem('panier', JSON.stringify(cart));
    alert('Vous avez ajouté ce produit dans votre panier')
  });
}
addToCart()

// Récupération des données de l'API
    fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(product => displayProduct(product))
    .catch(err => console.error(err))
