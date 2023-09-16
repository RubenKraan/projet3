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

async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => (cards = data));
    const btnTitle = getButtonTitles(cards);
    console.log(`le titre des BTN filtres  : ${btnTitle.join("  /  ")}`);
    console.log(cards);
    filtersBtn(btnTitle);
    workDisplay(cards);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}

async function fetchApiCategories() {
  try {
    await fetch(api + "categories")
      .then((res) => res.json())
      .then((data) => (categories = data));
    console.log(categories);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}

function getButtonTitles(cards) {
  return [...new Set(cards.map((card) => card.category.name))];
}

function filtersBtn(btnTitle) {
  // Créer le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.classList.add("btn", "active");
  allButton.textContent = "Tous";
  filterButtons.appendChild(allButton);
  filterButtons.classList.add("filter");

function cardsTemplate(card) {
        const cardDisplay = document.createElement("figure");
        cardDisplay.setAttribute("data-card-id", card.id);
        cardDisplay.setAttribute("value", card.categoryId);
        const titleCard = document.createElement("figcaption");
        titleCard.textContent = card.title;
        cardDisplay.appendChild(imgCard);
        cardDisplay.appendChild(titleCard);
        portfolioSection.appendChild(cardDisplay);
        return cardDisplay;
      }  
  const buttons = [
        allButton,
        ...btnTitle.map((categoryName) => {
          const button = document.createElement("button");
          button.classList.add("btn");
          button.textContent = categoryName;
          filterButtons.appendChild(button);
          return button;
        }),
      ];buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          categoryIdValue = e.target.textContent;
          console.log(categoryIdValue);
          buttons.forEach((btn) => {
            btn.classList.remove("active");
          });
          e.target.classList.add("active");
          workDisplay();
        });
      });
    }
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
      window.addEventListener("load", (e) => {
        fetchApiWorks();
        fetchApiCategories();
        categoryIdValue = "Tous";
        checkToken();
      });
      


