'use strict';

/* Création des variables */
/*------------------------*/

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
// tableau récueillant les options séléctionnées par l'utilisateur
const cart = []
// Lecture des clés et objets stockées dans le local storage
let produitsEnregistresDansLocalStorage = JSON.parse(localStorage.getItem('panier'));

/*------------------------*/

/* Création des fonctions */
/*------------------------*/

// Affichage du produit séléctionné en amont sur la page d'accueil
function displayProduct(product) {
  image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    title.innerHTML = `<h1>${product.name}</h1>`
    price.innerHTML = `<p>${product.price}</p>`
    description.innerHTML = `<p>${product.description}</p>`
    product.colors.forEach((color) => colorSelectElement.innerHTML += `<option value="${color}">${color}</option>`)
}

// Fonction PopupConfirmation demandant a l'utilisateur si il souhaite aller au panier ou continuer ses achats
const popupConfirmation = () => {
  if (window.confirm(`le produit: ${id} avec la couleur: ${colorSelectElement.value} a bien été ajouté au panier. 
  aller au panier OK ou revenir a l'accueil ANNULER`)) {
    window.location.href = 'cart.html'
  } else {
    window.location.href = 'index.html'
  }
}

/*------------------------*/

// Création de la fonction addToCart permettant de gérer l'envoi des données vers le panier

function addToCart() {

  // Si aucun produit n'est séléctionné, alors un message d'erreur apparait au clic sur le bouton "ajouter au panier"
  addToCartButton.addEventListener('click', function () {
    if (colorSelectElement.value === "" || quantitySelectElement.value <= 0) {
      alert('Vous devez séléctionner une couleur ET une quantité')
      return;
    }

// Création du tableau et envoi vers localstorage

    // Objet qui va acceuillir les données séléctionnées via les input
    let cartInit = {
      id_produit: id,
      couleur: colorSelectElement.value,
      quantité: quantitySelectElement.value
    }

    // Si il y a déjà une clé 'panier' dans le local storage, ajouter les données séléctionnés
    if (produitsEnregistresDansLocalStorage) {
      produitsEnregistresDansLocalStorage.push(cartInit);
      localStorage.setItem('panier', JSON.stringify(produitsEnregistresDansLocalStorage))
      popupConfirmation();
    }
    // Si il n'y a pas de clé 'panier' dans le local storage, création de la clé panier et du tableau
    else {
      produitsEnregistresDansLocalStorage = []
      produitsEnregistresDansLocalStorage.push(cartInit);
      localStorage.setItem('panier', JSON.stringify(produitsEnregistresDansLocalStorage))
      popupConfirmation();
    }
  })
}
addToCart()

// Récupération des données de l'API
    fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(product => displayProduct(product))
    .catch(err => console.error(err))