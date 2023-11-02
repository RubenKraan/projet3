const api = "http://localhost:5678/api/";
const token = localStorage.getItem("token");
let categoryIdValue = "";
let categories = [];
let btnTitle = [];
const btnSort = document.querySelectorAll(".btn");
const filterButtons = document.createElement("div");
const portfolioSection = document.querySelector("#portfolio");
portfolioSection
  .querySelector("h2")
  .insertAdjacentElement("afterend", filterButtons);
const imageUrls = [];
// fetcher router works
async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (cards = data));
    const btnTitle = getButtonTitles(cards);
    
    filtersBtn(btnTitle);
    workDisplay(cards);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}
//fetcher router categories
async function fetchApiCategories() {
  try {
    await fetch(api + "categories")
      .then((res) => res.json())
      .then((data) => (categories = data));
   
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}
// get dynamique categories called in fetchApiWorks
function getButtonTitles(cards) {
  return [...new Set(cards.map((card) => card.category.name))];
}
// create dynamique buttons called in fetchApiWorks
function filtersBtn(btnTitle) {
  // Créer le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.classList.add("btn", "active");
  allButton.textContent = "Tous";
  filterButtons.appendChild(allButton);
  filterButtons.classList.add("filter");

  // Créer les boutons filtres
  const buttons = [
    allButton,
    ...btnTitle.map((categoryName) => {
      const button = document.createElement("button");
      button.classList.add("btn");
      button.textContent = categoryName;
      filterButtons.appendChild(button);
      return button;
    }),
  ]; 
  // Gestionnaire d'événement pour les boutons filtres
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      categoryIdValue = e.target.textContent;
      
      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      workDisplay();
    });
  });
}
//creation cards
function cardsTemplate(card) {
  const cardDisplay = document.createElement("figure");
  cardDisplay.setAttribute("data-card-id", card.id);
  cardDisplay.setAttribute("value", card.categoryId);
  const imgCard = document.createElement("img");
  imgCard.setAttribute("src", card.imageUrl);
  imgCard.setAttribute("alt", "photo de " + card.title);
  const titleCard = document.createElement("figcaption");
  titleCard.textContent = card.title;
  cardDisplay.appendChild(imgCard);
  cardDisplay.appendChild(titleCard);
  portfolioSection.appendChild(cardDisplay);
  return cardDisplay;
}
//injection des cartes dans le html
function workDisplay() {
  const gallery = document.querySelector(".gallery");
  const cardDisplay = new Set();
  gallery.innerHTML = "";
  cards.forEach((card) => {
    if (categoryIdValue === "Tous" || card.category.name === categoryIdValue) {
      cardDisplay.add(card);
    }
  });
  cardDisplay.forEach((card) => {
    gallery.appendChild(cardsTemplate(card));
  });
}
//logique chargement de page
window.addEventListener("load", (e) => {
  fetchApiWorks();
  fetchApiCategories();
  categoryIdValue = "Tous";
  checkToken();
});
// check token admin 
function checkToken() {
  const token = localStorage.getItem("token");
  if (token) {
    adminEdition();
  } else {
    console.log("");
  }
}
//log out
function removeToken() {
  localStorage.removeItem("token");
}


