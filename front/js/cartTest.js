"use strict";

// Déclaration des variables
const totalQuantityElement = document.querySelector("#totalQuantity");
const totalPriceElement = document.querySelector("#totalPrice");
const cartItemsElement = document.querySelector("#cart__items");
const formDataElement = document.querySelector("form.cart__order__form");
const form = document.querySelector(".cart__order__form");

let allProducts;
const cart = JSON.parse(localStorage.getItem("cart"));
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
  displayCart();
  calculateCartAmount();
}

// Injection des produits dans le DOM
function displayCart() {
  cartItemsElement.innerHTML = "";
  cart.forEach((item) => {
    let product = allProducts.find((product) => item.id === product._id);
    cartItemsElement.insertAdjacentHTML(
      "beforeend",
      `<article class="cart__item">
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
      </article>`,
    );
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

// Ajout d'un écouteur d'événement pour la modification de quantité et le bouton supprimer
function addQtyInputEventListener() {
  // Cibler dans le DOM les éléments reliés aux inputs

  const quantitySelectElement = document.querySelectorAll(
    'input[name="itemQuantity"]',
  );

  // ************** MISE A JOUR QUANTITE DANS LE PANIER **************

  // Récupération des data-id et data-color des produits à modifier
  quantitySelectElement.forEach((element) => {
    element.addEventListener("input", (event) => {
      let selectElementId = element.dataset.id;
      let selectElementColor = element.dataset.color;

      // Mettre en corélation les data du DOM et les éléments dans le panier
      let productAlreadyInCart = cart.find(
        (product) =>
          product.id === selectElementId &&
          product.color === selectElementColor,
      );

      // Si le produit est déjà dans le panier, alors on mets à jour la quantité
      if (productAlreadyInCart) {
        productAlreadyInCart.quantity = event.target.value;
        saveToLocalStorage("cart", cart);
        calculateCartAmount();
      }
    });
  });
}

// ************** SUPPRESSION D'UN PRODUIT DANS LE PANIER **************

// Ecouteur d'événement sur bouton "supprimer"
function addDeleteInputEventListener() {
  // Ciblage des boutons 'supprimer' dans le DOM
  const deleteSelectElement = document.querySelectorAll(".deleteItem");
  deleteSelectElement.forEach((deleteButton) => {
    // Parcours des boutons puis ajout de l'écouteur
    deleteButton.addEventListener("click", displayPopUpProductDeleted());
  });
}

//fenêtre pop-up
function displayPopUpProductDeleted() {
  // Insertion dans le DOM de la fenêtre pop-up à la fin de la div "cart__item"
  const deleteSelectElement = document.querySelector(
    ".cart__item__content__settings__delete",
  );
  deleteSelectElement.insertAdjacentHTML(
    "beforeend",
    '<div id=popUpProductDeleted><p>Confirmez-vous la suppression?</p><button class="confirmer">Confirmer</button><button class="annuler">Annuler</button></div>',
  );
  const popUpConfirmationElement = document.getElementById(
    "popUpProductDeleted",
  );
  // CSS afin de styliser la fenêtre pop-up
  popUpConfirmationElement.style.zIndex = "2";
  popUpConfirmationElement.style.textAlign = "center";
  popUpConfirmationElement.style.position = "fixed";
  popUpConfirmationElement.style.bottom = "100px";
  popUpConfirmationElement.style.right = "400px";
  popUpConfirmationElement.style.height = "100px";
  popUpConfirmationElement.style.width = "300px";
  popUpConfirmationElement.style.fontWeight = "bold";
  popUpConfirmationElement.style.borderRadius = "15px";
  popUpConfirmationElement.style.background = "red";
  document
    .querySelector(".confirmer")
    .addEventListener("click", deleteCartProduct());
  document.querySelector(".annuler").addEventListener("click", closePopUp());
}

// Fonction fermant la fenêtre pop-up en supprimant la div html afin d'éviter les répétitions dans le html si l'utilisateur clic plusieurs fois sur le bouton
function closePopUp() {
  const popUpConfirmationElement = document.querySelector(
    "#popUpProductDeleted",
  );
  popUpConfirmationElement.remove();
}

function deleteCartProduct() {
  // Savoir quel est l'id et la couleur séléctionné
  const quantitySelectElement = document.querySelectorAll(
    'input[name="itemQuantity"]',
  );

  // ************** MISE A JOUR QUANTITE DANS LE PANIER **************

  // Récupération des data-id et data-color des produits à modifier
  quantitySelectElement.forEach((element) => {
    element.addEventListener("input", (event) => {
      let selectElementId = element.dataset.id;
      let selectElementColor = element.dataset.color;

      // Application d'une méthode find afin de trouver le produit concerné par le bouton 'supprimer'
      let findItemToDelete = cart.find(
        (product) =>
          product.id === selectElementId &&
          product.color === selectElementColor,
      );
      // Méthode indexOf afin de trouver l'index de l'objet a supprimer dans l'objet cart
      let itemToDelete = cart.indexOf(findItemToDelete);
      // Méthode Cart.splice afin de supprimer l'item via son index
      cart.splice(itemToDelete, 1);

      // Envoi vers local storage
      saveToLocalStorage("cart", cart);

      // Alerte produit supprimé et refresh du panier
      closePopUp();
      refreshCart();
    });
  });
}

// ************** VALIDATION FORMULAIRE DE CONTACT **************

// Mise en place des regExp
const regEmail = new RegExp(
  "^[a-zA-Z0-9.-_-]+[@]{1}[a-zA-Z0-9.-_-]+[.]{1}[a-z]{2,10}$",
);
const regAddress = new RegExp("^[0-9a-zA-Zà-ùÀ-Ù- -',]+$");
const regName = new RegExp("^[a-zA-Zà-ùÀ-Ù- -']+$");

// Ciblage dans le DOM
const firstNameInput = document.getElementById("firstName");
const firstNameErrorMsgElement = document.getElementById("firstNameErrorMsg");
const lastNameInput = document.getElementById("lastName");
const lastNameErrorMsgElement = document.getElementById("lastNameErrorMsg");
const addressInput = document.getElementById("address");
const addressErrorMsgElement = document.getElementById("addressErrorMsg");
const cityInput = document.getElementById("city");
const cityErrorMsgElement = document.getElementById("cityErrorMsg");
const emailInput = document.getElementById("email");
const emailErrorMsgElement = document.getElementById("emailErrorMsg");

// Mise en place des écouteurs d'evenements et des messages d'erreurs sur les inputs
firstNameInput.addEventListener("input", (event) => {
  if (!regName.test(event.target.value)) {
    firstNameErrorMsgElement.textContent =
      "Prénom invalide - Nombres et caractères spéciaux non autorisés";
  } else {
    firstNameErrorMsgElement.textContent = "";
  }
});

lastNameInput.addEventListener("input", (event) => {
  if (!regName.test(event.target.value)) {
    lastNameErrorMsgElement.textContent =
      "Nom invalide - Nombres et caractères spéciaux non autorisés";
  } else {
    lastNameErrorMsgElement.textContent = "";
  }
});

addressInput.addEventListener("input", (event) => {
  if (!regAddress.test(event.target.value)) {
    addressErrorMsgElement.textContent =
      "Adresse invalide - L'adresse saisie ne doit pas contenir de caractères spéciaux";
  } else {
    addressErrorMsgElement.textContent = "";
  }
});

cityInput.addEventListener("input", (event) => {
  if (!regName.test(event.target.value)) {
    cityErrorMsgElement.textContent =
      "Ville invalide - La ville saisie ne doit contenir ni caractères spéciaux ni nombres";
  } else {
    cityErrorMsgElement.textContent = "";
  }
});

emailInput.addEventListener("input", (event) => {
  if (!regEmail.test(event.target.value)) {
    emailErrorMsgElement.textContent =
      "Email invalide - Un mail contient au moins le signe @ et une extension (.fr, .com, etc...)";
  } else {
    emailErrorMsgElement.textContent = "";
  }
});

// ************** Préparation et envoi de la commande **************

function getOrder() {
  const products = cart.map((items) => items.id);

  // Création de l'objet contact via formData
  const formData = new FormData(formDataElement);
  const values = [...formData.entries()];

  // Conversion du tableau values en object contact pour traitement
  const contact = Object.fromEntries(values);

  // Création d'un objet global reprenant produits et contact
  return { contact, products };
}

// Ajout d'un écouteur d'événement sur le bouton "Commander!"
form.addEventListener("submit", (event) => {
  // Annulation du comportement par défaut du click afin de donner des instructions avant submit
  event.preventDefault();
  const order = getOrder();

  sendOrder(order);
});

// Création de la fonction qui va traiter et envoyer les données du panier vers l'API puis emmener l'utilisateur vers la page confirmation
function sendOrder(order) {
  // Condition si tous les inputs sont correctement remplis, alors on lance le traitement des données et on envoi vers la page confirmation
  if (
    !firstNameErrorMsgElement.textContent.length &&
    !lastNameErrorMsgElement.textContent.length &&
    !addressErrorMsgElement.textContent.length &&
    !cityErrorMsgElement.textContent.length &&
    !emailErrorMsgElement.textContent.length
  ) {
    // Création de l'objet pour la méthode POST
    const postOptions = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    // Demande du numéro de commande a l'API selon les informations envoyées, clear du localstorage puis envoi vers page confirmation
    fetch("http://localhost:3000/api/products/order", postOptions)
      .then((response) => response.json())
      .then((data) => {
        localStorage.clear();
        document.location.href = `confirmation.html?orderId=${data.orderId}`;
      })
      .catch((err) => console.error(err));
  }
}

// Récupération des données de l'API
fetch(url)
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;
    if (cart) {
      displayCart();
      calculateCartAmount();
      addQtyInputEventListener();
      addDeleteInputEventListener();
    }
  })
  .catch((err) => console.error(err));