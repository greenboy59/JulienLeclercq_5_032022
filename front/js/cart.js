"use strict";

// Déclaration des variables
const totalQuantityElement = document.querySelector("#totalQuantity");
const totalPriceElement = document.querySelector("#totalPrice");
const cartItemsElement = document.querySelector("#cart__items");
const submitButton = document.querySelector("#order");
const formDataElement = document.querySelector("form.cart__order__form");

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

// Injections DOM
function displayCart(products) {
  cart.forEach((item) => {
    const product = products.find((product) => item.id === product._id);
    cartItemsElement.innerHTML += `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
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
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
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
function modifyCartQuantity() {
  // Cibler dans le DOM les éléments reliés aux input 

    document.querySelectorAll("article").forEach((itemSelected) => {
      // Récupération des data-id et data-color des produits à modifier
      itemSelected.addEventListener("change", (event) => {
        let idSelectElement = itemSelected.dataset.id;
        let colorSelectElement = itemSelected.dataset.color;

        // Mettre en corélation les data du DOM et les éléments dans le panier
        let productAlreadyInCart = cart.find((product) => product.id === idSelectElement && product.color === colorSelectElement);
        
        // Si le produit est déjà dans le panier, alors on mets à jour la quantité
        if (productAlreadyInCart) {
          productAlreadyInCart.quantity = event.target.value;
          saveToLocalStorage("cart", cart);
          calculateCartAmount();
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

      // Application d'une méthode filter afin de supprimer le produit concerné par le bouton 'supprimer'
      cart = cart.filter((product) => product.id !== idToDelete && product.coulor !== colorToDelete,);

      // Mise à jour du local storage
      saveToLocalStorage("cart", cart)

      //Alerte produit supprimé et reload de la page
      alert("Ce produit a bien été supprimé de votre panier");
      location.reload();
    });
  })
}

// ************** VALIDATION FORMULAIRE DE CONTACT **************

// 1. Récupérer et analyser les données saisies par l’utilisateur dans le formulaire (Attention à bien vérifier les données saisies par l’utilisateur.)

// 2. Afficher un message d’erreur si besoin (par exemple lorsqu’un utilisateur renseigne “bonjour” dans le champ “e-mail”) (Lors de la vérification des données via des regex, attention à bien mener des tests pour vérifier le bon fonctionnement des regex.)

// 3. Constituer un objet contact (à partir des données du formulaire) et un tableau de produits

// Création d'un tableau qui va récupérer les données saisies dans le formulaire

let contact = [];

// Déclaration des Regex
const regEmail = new RegExp("^[a-zA-Z.-_0-9]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$","g",);
const regAddress = new RegExp("^[0-9a-zA-Zà-ùÀ-Ù- -',]+$", "g");
const regName = new RegExp("^[a-zA-Zà-ùÀ-Ù- -]+$", "g");

// Fonction permettant de checker le remplissage des input
function validForm() {

  // Parcours tous les éléments dans le formmulaire
  document.querySelectorAll('.cart__order').forEach((inputForm) => {

    // Mise en place de l'écouteur d'event
    inputForm.addEventListener("change", (event) => {

      // Définition de l'emplacement ou doivent s'afficher les messages d'erreur ou de validation
      let errorMsg = event.target.nextElementSibling;

      // Définition de l'élément à tester selon son id
      let inputToTest = event.target.id

      // Conditions en cas d'expressions régulières correctement ou incorrectement saisies
      if (event.target) {

        if ((inputToTest == "firstName" || inputToTest == "lastName") &&
          (regName.test(event.target.value) || regName.test(event.target.value))) {
          errorMsg.innerHTML = "VALIDE";
          return true;
        }
        if ((inputToTest == "address" || inputToTest == "city")
          && (regAddress.test(event.target.value) || regAddress.test(event.target.value))) {
          errorMsg.innerHTML = "VALIDE";
          return true;
        }
        if (inputToTest === "email" && regEmail.test(event.target.value)) {
          errorMsg.innerHTML = "VALIDE";
          return true;
        }
        else {
          errorMsg.innerHTML = "INVALIDE - Veuillez saisir des données correctes";
          return false;
        }
      }
    })
  })
}
validForm()

function validOrder() {
  // Ajout d'un écouteur sur le bouton "Commander!"
  submitButton.addEventListener("click", (event) => {

    // Annulation du comportement par défaut du click afin de donner des instructions avant
    event.preventDefault();

    // Afficher dans un objet les valeurs du formulaire via formData
    const formData = new FormData(formDataElement);
    const values = [...formData.entries()];
    contact.push(values);

    // Séléction des messages d'erreur dans le DOM afin d'autoriser le submit si tous les champs sont valides 
    document.querySelectorAll(".cart__order__form__question").forEach((errorMessage) => {
      let inputValid = errorMessage.querySelector("p").textContent;
        if (inputValid === 'VALIDE') {
          console.log("Formulaire autorisé");
        } else {
          console.log("formulaire non valide");
        }
      });
  });
}
validOrder()

// Récupération des données de l'API
fetch(url)
  .then((response) => response.json())
  .then((products) => {
    displayCart(products);
    calculateCartAmount();
    modifyCartQuantity();
    deleteCartItem();
  })
  .catch((err) => console.error(err))