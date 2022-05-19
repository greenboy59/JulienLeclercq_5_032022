"use strict";

const totalQuantityElement = document.querySelector("#totalQuantity");
const totalPriceElement = document.querySelector("#totalPrice");
const cartItemsElement = document.querySelector("#cart__items");
const formDataElement = document.querySelector("form.cart__order__form");
const form = document.querySelector(".cart__order__form");

let allProducts;
const cart = JSON.parse(localStorage.getItem("cart"));

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
              <input data-id="${item.id}" data-color="${item.color}" type="number" 
              class="itemQuantity" name="itemQuantity" min="1" max="100"
              maxlength="3" oninput="changeHandlerQty(this)" value="${item.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p data-id="${item.id}" data-color="${item.color}" class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
    );
  });
}

function changeHandlerQty(val) {
  if (Number(val.value) > 100) {
    val.value = 100;
  }
  if (Number(val.value) < 0) {
    val.value = 0;
  }
  if (!Number.isInteger(Number(val.value))) {
    val.value = parseInt(val.value);
  }
}

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

// Variables stockant les datas des produits concernés par les quantités à modifier
let idOfElementToModify;
let colorOfElementToModify;
let eventQty;

function addEventListenerOnQtyInput() {
  const quantitySelectElement = cartItemsElement.querySelectorAll('input[name="itemQuantity"]');
  // Récupération des data-id et data-color des produits à modifier
  quantitySelectElement.forEach((element) => {
    element.addEventListener("input", (event) => {
      idOfElementToModify = element.dataset.id;
      colorOfElementToModify = element.dataset.color;
      eventQty = event.target.value;

      modifyCartQty();
    });
  });
}

function modifyCartQty() {
  let productAlreadyInCart = cart.find((product) => product.id === idOfElementToModify && product.color === colorOfElementToModify);

  if (productAlreadyInCart) {
    productAlreadyInCart.quantity = eventQty;
    saveToLocalStorage("cart", cart);
    calculateCartAmount();
  }
}

// ************** SUPPRESSION D'UN PRODUIT DANS LE PANIER **************

// Variable stockant les datas permettant d'identifer le produit séléctionné
let selectItemToDelete;

function addEventListenerOnDeleteBtn() {
  const deleteButtonsElement = document.querySelectorAll(".deleteItem");
  deleteButtonsElement.forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      selectItemToDelete = deleteButton;
      displayPopUpProductDeleted();
    });
  });
}

function displayPopUpProductDeleted() {
  // Ouverture d'une fenêtre uniquement si une fenêtre n'est pas déjà ouverte
  if (!document.getElementById("popUpProductDeleted")) {
    const deleteSelectElement = document.querySelector(".limitedWidthBlockContainer");
    deleteSelectElement.insertAdjacentHTML("beforeend",
      `<div id=popUpProductDeleted>
      <p> Confirmez - vous la suppression ?</p><br>
      <button type = "button" class= "confirmer"> CONFIRMER </button>
      <button type="button" class="annuler"> ANNULER </button>
      </div>`
    );

    const popUpConfirmationElement = document.getElementById("popUpProductDeleted");
    const popUpBtn = document.querySelector(".confirmer");

    popUpBtn.style.marginRight = "15px";
    popUpConfirmationElement.style.textAlign = "center";
    popUpConfirmationElement.style.font = "bold 18px/1.7 helvetica";
    popUpConfirmationElement.style.position = "fixed";
    popUpConfirmationElement.style.bottom = "45%";
    popUpConfirmationElement.style.margin = "0 auto";
    popUpConfirmationElement.style.boxShadow = "2px 2px 10px #2d3e50";
    popUpConfirmationElement.style.height = "150px";
    popUpConfirmationElement.style.width = "350px";
    popUpConfirmationElement.style.borderRadius = "25px";
    popUpConfirmationElement.style.background = "#2d3e50";

    document.querySelector(".confirmer").addEventListener("click", deleteItem);
    document.querySelector(".annuler").addEventListener("click", closePopUp);
  } 
}

function closePopUp() {
  const popUpConfirmationElement = document.querySelector("#popUpProductDeleted");
  popUpConfirmationElement.remove();
}

function deleteItem() {
  const itemToDelete = cart.findIndex((item) => item.id === selectItemToDelete.dataset.id && item.color === selectItemToDelete.dataset.color);
  cart.splice(itemToDelete, 1);
  saveToLocalStorage("cart", cart);

  refreshCart();
  closePopUp();
}

// ************** VALIDATION FORMULAIRE DE CONTACT **************

const regEmail = new RegExp("^[a-zA-Z0-9.-_-]+[@]{1}[a-zA-Z0-9.-_-]+[.]{1}[a-z]{2,10}$");
const regAddress = new RegExp("^[0-9a-zA-Zà-ùÀ-Ù- -',]+$");
const regName = new RegExp("^[a-zA-Zà-ùÀ-Ù- -']+$");

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
    firstNameErrorMsgElement.textContent = "⛔️ Prénom invalide - Nombres et caractères spéciaux non autorisés";
  }
  else {
    firstNameErrorMsgElement.textContent = "";
  }
});

lastNameInput.addEventListener("input", (event) => {
  if (!regName.test(event.target.value)) {
    lastNameErrorMsgElement.textContent = "⛔️ Nom invalide - Nombres et caractères spéciaux non autorisés";
  }
  else {
    lastNameErrorMsgElement.textContent = "";
  }
});

addressInput.addEventListener("input", (event) => {
  if (!regAddress.test(event.target.value)) {
    addressErrorMsgElement.textContent = "⛔️ Adresse invalide - L'adresse saisie ne doit pas contenir de caractères spéciaux";
  }
  else {
    addressErrorMsgElement.textContent = "";
  }
});

cityInput.addEventListener("input", (event) => {
  if (!regName.test(event.target.value)) {
    cityErrorMsgElement.textContent = "⛔️ Ville invalide - La ville saisie ne doit contenir ni caractères spéciaux ni nombres";
  }
  else {
    cityErrorMsgElement.textContent = "";
  }
});

emailInput.addEventListener("input", (event) => {
  if (!regEmail.test(event.target.value)) {
    emailErrorMsgElement.textContent = "⛔️ Email invalide - Un mail contient au moins le signe @ et une extension (.fr, .com, etc...)";
  }
  else {
    emailErrorMsgElement.textContent = "";
  }
});

// ************** Préparation et envoi de la commande **************

/**
 * 
 * @returns {object} Containing datas of contact (from form entries) and products id ([string] <-- array of product _id)
 */
function getOrder() {
  const products = cart.map((items) => items.id);
  const formData = new FormData(formDataElement);
  const values = [...formData.entries()];
  const contact = Object.fromEntries(values);

  return { contact, products };
}

// Ajout d'un écouteur d'événement sur le bouton "Commander!". Appel de la fonction sendOrder
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const order = getOrder();
  sendOrder(order);
});

function sendOrder(order) {
  let totalQtyCheck = document.getElementById("totalQuantity").textContent;

  if (isNaN(totalQtyCheck) && !document.querySelector(".helperSubmit")) {
    document.querySelector(".cart__order__form__submit").insertAdjacentHTML("beforebegin",
      '<div class="helperSubmit"><p>⛔️ Veuillez vérifier les quantités pour chaque article !</p></div>'
    );
    document.querySelector(".helperSubmit").style.font = "bold 1em helvetica, sans-serif";
    document.querySelector(".helperSubmit").style.textAlign = "center";
    setTimeout(closeHelperSubmit, 1800);
  }
  if (
    !firstNameErrorMsgElement.textContent.length &&
    !lastNameErrorMsgElement.textContent.length &&
    !addressErrorMsgElement.textContent.length &&
    !cityErrorMsgElement.textContent.length &&
    !emailErrorMsgElement.textContent.length &&
    Number.isInteger(Number(totalQtyCheck))
  ) {
    const postOptions = {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };

    // Demande du numéro de commande a l'API selon les informations envoyées. Clear du localstorage
    fetch("http://localhost:3000/api/products/order", postOptions)
      .then((response) => response.json())
      .then((data) => {
        localStorage.clear();
        document.location.href = `confirmation.html?orderId=${data.orderId}`;
      })
      .catch((err) => console.error(err));
  }
}

function closeHelperSubmit () {
  document.querySelector(".helperSubmit").remove();
}

// Récupération des données de l'API
fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;
    if (cart) {
      displayCart();
      calculateCartAmount();
      addEventListenerOnQtyInput();
      addEventListenerOnDeleteBtn();
    }
  })
  .catch((err) => console.error(err));