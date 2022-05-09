"use strict";

// Déclaration des variables
const totalQuantityElement = document.querySelector("#totalQuantity");
const totalPriceElement = document.querySelector("#totalPrice");
const cartItemsElement = document.querySelector("#cart__items");
const formDataElement = document.querySelector("form.cart__order__form");
const form = document.querySelector(".cart__order__form");

let allProducts
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
    cartItemsElement.insertAdjacentHTML('beforeend',
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
      </article>`
    );
  });
  deleteCartItem()
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
};

// Modifier la quantité d'un produit directement dans le panier via l'input itemQuantity
function addInputEventListeners() {
  // Cibler dans le DOM les éléments reliés aux inputs

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
      let itemToDelete = cart.indexOf(findItemToDelete)
      // Méthode Cart.splice afin de supprimer l'item via son index
      cart.splice(itemToDelete, 1);
      
      // Envoi vers local storage
      saveToLocalStorage("cart", cart);

      //Alerte produit supprimé et refresh de l'html
      displayPopUpProductDeleted();
      refreshCart();
    });
  })
}

//fenêtre pop-up
function displayPopUpProductDeleted() {
  // Insertion dans le DOM de la fenêtre pop-up à la fin de la div "cart__item"
  document.querySelector("body").insertAdjacentHTML("afterbegin", `<div id=popUpProductDeleted><p>Produit supprimé du panier</p></div>`);
  const popUpConfirmationElement = document.getElementById("popUpProductDeleted");
  // CSS afin de styliser la fenêtre pop-up
  popUpConfirmationElement.style.textAlign = "center";
  popUpConfirmationElement.style.position = "fixed";
  popUpConfirmationElement.style.top = "30px";
  popUpConfirmationElement.style.right = "30px";
  popUpConfirmationElement.style.height = "50px";
  popUpConfirmationElement.style.width = "300px";
  popUpConfirmationElement.style.fontWeight = "bold";
  popUpConfirmationElement.style.borderRadius = "15px";
  popUpConfirmationElement.style.background = "red";
  // setTimeout afin de fermer automatiquement le pop-up au bout de 2s
  setTimeout(closePopUp, 2000);
};

// Fonction fermant la fenêtre pop-up en supprimant la div html afin d'éviter les répétitions dans le html si l'utilisateur clic plusieurs fois sur le bouton
function closePopUp() {
  const popUpConfirmationElement = document.querySelector("#popUpProductDeleted");
  popUpConfirmationElement.remove();
}

// ************** VALIDATION FORMULAIRE DE CONTACT **************

// Mise en place des regExp
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

// Mise en place des écouteurs d'evenements et des messages d'erreurs sur les inputs
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

// ************** Préparation et envoi de la commande **************

// Ajout d'un écouteur sur le bouton "Commander!"
form.addEventListener('submit', (event) => {
  // Annulation du comportement par défaut du click afin de donner des instructions avant submit
  event.preventDefault();

  // Création d'un tableau d'id produits
  let idProducts = [];
  cart.forEach((product) => {
    idProducts.push(product.id);
  });

  // Création de l'objet contact via formData
  const formData = new FormData(formDataElement);
  const values = [...formData.entries()];

  // Conversion du tableau values en object contact pour traitement
  const contact = Object.fromEntries(values);

  // Création d'un objet global reprenant produits et contact
  const orderArray = {
    contact: contact,
    products: idProducts,
  };

  // Création de l'objet pour la méthode POST
  const postOptions = {
    method: "POST",
    body: JSON.stringify(orderArray),
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
    },
  };

  // Création de la fonction qui va traiter et envoyer les données du panier vers l'API puis emmener l'utilisateur vers la page confirmation
  function sendOrder() {
    // Condition si tous les inputs sont correctement remplis, alors on lance le traitement des données et on envoi vers la page confirmation
    if (
      !!!firstNameErrorMsgElement.textContent &&
      !!!lastNameErrorMsgElement.textContent &&
      !!!addressErrorMsgElement.textContent &&
      !!!cityErrorMsgElement.textContent &&
      !!!emailErrorMsgElement.textContent
    ) {
      // Demande du numéro de commande a l'API selon les informations envoyées, clear du localstorage puis envoi vers page confirmation
      fetch("http://localhost:3000/api/products/order", postOptions)
        .then((response) => response.json())
        .then((data) => {
          localStorage.clear();
          const orderId = data.orderId;
          document.location.href = `confirmation.html?orderId=${orderId}`;
        })
        .catch((err) => console.error(err));
    } else {
      event.preventDefault();
    }
  }
  sendOrder();
})

// Récupération des données de l'API
fetch(url)
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;
    deleteCartItem();
    displayCart();
    calculateCartAmount();
    addInputEventListeners();
  })
  .catch((err) => console.error(err))