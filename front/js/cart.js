"use strict";

// Déclaration des variables
const totalQuantityElement = document.querySelector("#totalQuantity");
const totalPriceElement = document.querySelector("#totalPrice");
const cartItemsElement = document.querySelector("#cart__items");
const formDataElement = document.querySelector("form.cart__order__form");
const form = document.querySelector(".cart__order__form");

let allProducts
let cart = JSON.parse(localStorage.getItem("cart"));
const url = `http://localhost:3000/api/products`;

/**
 * @param key {string}
 * @param item {any}
 * @returns {any}
 */
function saveToLocalStorage(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
}

function refreshCart() {
  displayCart()
  calculateCartAmount()
}

// Injections DOM
function displayCart() {

  cart.forEach((item) => {
    let product = allProducts.find((product) => item.id === product._id);
    cartItemsElement.innerHTML += `<article class="cart__item">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="Photographie d'un canapé">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${item.color}</p>
              <p><span class="item__price">${product.price}</span> €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <label>Qté:</label>
              <p> </p>
              <input data-id="${item.id}" data-color="${item.color}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
  });
}

// Calcul du montant et quantité totale pour l'afficher sur la page
function calculateCartAmount() {
  let cartSum = 0;
  let totalQuantity = 0;
  const cartHtmlElements = document.querySelectorAll(".cart__item");
  cartHtmlElements.forEach((element) => {
    const price = element.querySelector("span.item__price").textContent;
    const quantity = element.querySelector("input.itemQuantity").value;
    cartSum += parseInt(price) * parseInt(quantity);
    totalQuantity += parseInt(quantity);
  });
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = cartSum;
}  

// Modifier la quantité d'un produit directement dans le panier via l'input itemQuantity
function addInputEventListeners() {
  // Cibler dans le DOM les éléments reliés aux input

  const quantitySelectElement = document.querySelectorAll('input[name="itemQuantity"]',);
    // Récupération des data-id et data-color des produits à modifier
    quantitySelectElement.forEach((element) => {
      element.addEventListener("input", (event) => {
        let selectElementId = element.dataset.id;
        let selectElementColor = element.dataset.color;

        // Mettre en corélation les data du DOM et les éléments dans le panier
        let productAlreadyInCart = cart.find((product) => product.id === selectElementId && product.color === selectElementColor,);

        // Si le produit est déjà dans le panier, alors on mets à jour la quantité
        if (productAlreadyInCart) {
          productAlreadyInCart.quantity = event.target.value;
          saveToLocalStorage("cart", cart);
          calculateCartAmount()
        }
      });
    });
}

// Supprimer un produit en cas de click sur le bouton 'supprimer'
function deleteCartItem() {
  // Ciblage des boutons 'supprimer' dans le DOM
  document.querySelectorAll(".deleteItem").forEach((deleteButton, index) => {

    // Parcours des boutons puis ajout d'un écouteur d'événement 
    deleteButton.addEventListener('click', () => {

      // Séléction des items dans le panier portant le même index que le produit séléctionné
      let idToDelete = cart[index].id;
      let colorToDelete = cart[index].color;

      // Application d'une méthode find afin de trouver le produit concerné par le bouton 'supprimer'
      let findItemToDelete = cart.find((product) => product.id === idToDelete && product.color === colorToDelete,);
      // Méthode indexOf afin de trouver l'index de l'objet a supprimer dans l'objet cart
      let itemTodelete = cart.indexOf(findItemToDelete)
      // Méthode Cart.splice afin de supprimer l'item via son index
      cart.splice(itemTodelete, 1);
      
      saveToLocalStorage("cart", cart)

      //Alerte produit supprimé et reload de la page
      alert("Ce produit a bien été supprimé de votre panier");
      location.reload()
    });
  })
}

// ************** VALIDATION FORMULAIRE DE CONTACT **************

// 1. Récupérer et analyser les données saisies par l’utilisateur dans le formulaire (Attention à bien vérifier les données saisies par l’utilisateur.)

// 2. Afficher un message d’erreur si besoin (par exemple lorsqu’un utilisateur renseigne “bonjour” dans le champ “e-mail”) (Lors de la vérification des données via des regex, attention à bien mener des tests pour vérifier le bon fonctionnement des regex.)

// 3. Constituer un objet contact (à partir des données du formulaire) et un tableau de produits

// Création d'un tableau qui va récupérer les données saisies dans le formulaire

let getContact = []
const contact = Object.fromEntries(getContact);

const regEmail = new RegExp("^[a-zA-Z.-_0-9]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
const regAddress = new RegExp("^[0-9a-zA-Zà-ùÀ-Ù- -',]+$");
const reg = new RegExp("^[a-zA-Zà-ùÀ-Ù- -']+$");

// Ciblage dans le DOM
const firstNameInput = document.getElementById('firstName');
const firstNameErrorMsgElement = document.getElementById('firstNameErrorMsg');
const lastNameInput = document.getElementById('lastName');
const lastNameErrorMsgElement = document.getElementById("lastNameErrorMsg");
const addressInput = document.getElementById('address');
const addressErrorMsgElement = document.getElementById('addressErrorMsg');
const cityInput = document.getElementById("city");
const cityErrorMsgElement = document.getElementById("cityErrorMsg");
const emailInput = document.getElementById('email');
const emailErrorMsgElement = document.getElementById("emailErrorMsg");

// Mise en place des écouteurs d'evenements et des messages d'erreurs
firstNameInput.addEventListener("input", (event) => {
  if (!reg.test(event.target.value)) {
    firstNameErrorMsgElement.textContent = "Prénom invalide - Nombres et caractères spéciaux non autorisés";
  } else {
    firstNameErrorMsgElement.textContent = '';
  }
});

lastNameInput.addEventListener("input", (event) => {
  if (!reg.test(event.target.value)) {
    lastNameErrorMsgElement.textContent = "Nom invalide - Nombres et caractères spéciaux non autorisés";
  } else {
    lastNameErrorMsgElement.textContent = '';
  }
});

addressInput.addEventListener("input", (event) => {
  if (!regAddress.test(event.target.value)) {
    addressErrorMsgElement.textContent = "Adresse invalide - L'adresse saisie ne doit pas contenir de caractères spéciaux";
  } else {
    addressErrorMsgElement.textContent = '';
  }
});

cityInput.addEventListener("input", (event) => {
  if (!reg.test(event.target.value)) {
    cityErrorMsgElement.textContent = "Ville invalide - La ville saisie ne doit contenir ni caractères spéciaux ni nombres";
  } else {
    cityErrorMsgElement.textContent = '';
  }
});

emailInput.addEventListener("input", (event) => {
  if (!regEmail.test(event.target.value)) {
    emailErrorMsgElement.textContent = "Email invalide - Un mail contient au moins le signe @ et une extension (.fr, .com, etc...)";
  } else {
    emailErrorMsgElement.textContent = '';
  }
});

// Création de la fonction qui va traiter les données du panier, envoyer les informations vers l'API puis emmener l'utilisateur vers la page confirmation
function validOrder() {
  // Ajout d'un écouteur sur le bouton "Commander!"
  form.addEventListener('submit', (event) => {
    // Annulation du comportement par défaut du click afin de donner des instructions avant submit
    event.preventDefault();

    // Création de l'objet contact via formData
    const formData = new FormData(formDataElement);
    const values = [...formData.entries()];
    // Conversion du tableau values en object contact pour traitement
    const contact = Object.fromEntries(values);

    // Création d'un tableau d'id produits
    let idProducts = [];
    cart.forEach((product) => {
      idProducts.push(product.id);
    })

    // Création d'un objet global reprenant produits et contact
    const orderArray = {
      contact: contact,
      products: idProducts,
    };

    // Condition si tous les inputs sont correctement remplis, alors on lance le traitement des données et on envoi vers la page confirmation
    if (firstNameErrorMsgElement.textContent === '' && lastNameErrorMsgElement.textContent === '' &&
      addressErrorMsgElement.textContent === '' && cityErrorMsgElement.textContent === '' &&
      emailErrorMsgElement.textContent === ''
    ) {

      // Création de l'objet pour la méthode POST
      const postOptions = {
        method: 'POST',
        body: JSON.stringify(orderArray),
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        }
      }

      // Demande du numéro de commande a l'API selon les informations envoyées puis clear du localstorage
      fetch("http://localhost:3000/api/products/order", postOptions)
        .then((response) => response.json())
        .then((data) => {
          localStorage.clear();
          const orderId = data.orderId
          document.location.href = `confirmation.html?orderId=${orderId}`
        })
        .catch((err) => console.error(err))
    } else {
      event.preventDefault();
    }
  });
}
validOrder()

// Récupération des données de l'API
fetch(url)
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;
    displayCart();
    calculateCartAmount();
    addInputEventListeners();
    deleteCartItem();
  })
  .catch((err) => console.error(err))