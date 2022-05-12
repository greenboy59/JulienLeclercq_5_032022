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
  addEventListenerOnQtyInput();
  addEventListenerOnDeleteBtn();
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
              <p data-id="${item.id}" data-color="${item.color}" class="deleteItem">Supprimer</p>
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

// ************** MISE A JOUR DES QUANTITES **************

let idOfElementToModify;
let colorOfElementToModify;
let eventQty;

// Ajout d'un écouteur d'événement pour la modification de quantité et le bouton supprimer
function addEventListenerOnQtyInput() {
  // Cibler dans le DOM les éléments reliés aux inputs
  const quantitySelectElement = cartItemsElement.querySelectorAll('input[name="itemQuantity"]');

  // Récupération des data-id et data-color des produits à modifier
  quantitySelectElement.forEach((element) => {
    element.addEventListener("input", (event) => {
      idOfElementToModify = element.dataset.id;
      colorOfElementToModify = element.dataset.color
      eventQty = event.target.value;
      modifyCartQty();
    });
  });
}

// Fonction qui modifie la quantité dans le panier selon le nombre indiqué dans les inputs qté
function modifyCartQty() {
  // Mettre en corélation les data du DOM et les éléments dans le panier
  let productAlreadyInCart = cart.find((product) => product.id === idOfElementToModify && product.color === colorOfElementToModify);

  // Si le produit est déjà dans le panier, alors on mets à jour la quantité
  if (productAlreadyInCart) {
    productAlreadyInCart.quantity = eventQty;
    saveToLocalStorage("cart", cart);
    calculateCartAmount();
  }
}

// ************** SUPPRESSION D'UN PRODUIT DANS LE PANIER **************

let selectItemToDelete;

// Ajout d'un écouteur d'événement sur les boutons "supprimer" puis envoi des index vers le tableau "indexOfDeleteItem"
function addEventListenerOnDeleteBtn () {
  // Ciblage des boutons 'supprimer' dans le DOM
  document.querySelectorAll(".deleteItem").forEach((deleteButton) => {
    // Parcours des boutons puis ajout d'un écouteur d'événement
    deleteButton.addEventListener("click", () => {
      displayPopUpProductDeleted();
      selectItemToDelete = deleteButton;
    });
  });
} 

//fenêtre pop-up
function displayPopUpProductDeleted() {
  // Ouverture d'une fenêtre uniquement si une fenêtre n'est pas déjà ouverte
  if (!document.getElementById("popUpProductDeleted")) {
    // Insertion dans le DOM de la fenêtre pop-up avant la balise de fin de la div ".limitedWidthBlockContainer"
    const deleteSelectElement = document.querySelector(".limitedWidthBlockContainer");
    // Insertion du code html
    deleteSelectElement.insertAdjacentHTML(
      "beforeend",
      '<div id=popUpProductDeleted><p>Confirmez-vous la suppression?</p><br><button type="button" class="confirmer">CONFIRMER</button><button type="button" class="annuler">ANNULER</button></div>',
    );
    // Ciblage de la nouvelle div fraichement créée et du bouton
    const popUpConfirmationElement = document.getElementById("popUpProductDeleted");
    const popUpBtn = document.querySelector(".confirmer");
    // CSS afin de styliser la fenêtre pop-up
    popUpBtn.style.marginRight = "15px";
    popUpConfirmationElement.style.textAlign = "center";
    popUpConfirmationElement.style.font = "bold 18px/1.7 helvetica";
    popUpConfirmationElement.style.position = "fixed";
    popUpConfirmationElement.style.top = "50%";
    popUpConfirmationElement.style.margin = "0 auto";
    popUpConfirmationElement.style.boxShadow = "2px 2px 10px #2d3e50";
    popUpConfirmationElement.style.height = "150px";
    popUpConfirmationElement.style.width = "350px";
    popUpConfirmationElement.style.borderRadius = "25px";
    popUpConfirmationElement.style.background = "#2d3e50";
    // Ecouteurs d'événements sur les 2 boutons et appel des fonctions
    document.querySelector(".confirmer").addEventListener("click", deleteItem);
    document.querySelector(".annuler").addEventListener("click", closePopUp);
  }

  // Fonction fermant la fenêtre pop-up en supprimant la div html
  function closePopUp() {
    const popUpConfirmationElement = document.querySelector("#popUpProductDeleted");
    popUpConfirmationElement.remove();
  }
}

function deleteItem() {
  // Utilisation de la méthode findIndex afin de mettre en corélation le produit affiché et le produit dans l'objet "cart"
  const itemToDelete = cart.findIndex((item) => item.id === selectItemToDelete.dataset.id && item.color === selectItemToDelete.dataset.color);
  // Retrait du produit dans l'objet "cart"
  cart.splice(itemToDelete, 1);

  // Mise à jour du local storage
  saveToLocalStorage("cart", cart);

  // Refresh du panier 
  refreshCart();
}

// ************** VALIDATION FORMULAIRE DE CONTACT **************

// Mise en place des regExp
const regEmail = new RegExp("^[a-zA-Z0-9.-_-]+[@]{1}[a-zA-Z0-9.-_-]+[.]{1}[a-z]{2,10}$");
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
      addEventListenerOnDeleteBtn();
    if (cart) {
      displayCart();
      calculateCartAmount();
      addEventListenerOnQtyInput();
      addEventListenerOnDeleteBtn();
    }
  })
  .catch((err) => console.error(err));