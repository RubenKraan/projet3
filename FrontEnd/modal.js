//dom admin editor
function adminEdition() {
    adminHTML();
    const modalJs = document.getElementById("titleProjectRemove");
    modalJs.addEventListener("click", (e) => {
      e.preventDefault();
      modalHTML();
      displayModal();
      openModal();
      editModal();
    });
    // surpression des travaux de l'api
    const deleteWorksApi = document.querySelector("body > div > button");
    deleteWorksApi.addEventListener("click", (e) => {
      e.preventDefault();
      functionDeleteWorksApi();
    });
  }
  //autre fonction du mode admin
  function adminHTML() {
    // creation bandeau
    const flagEditor = document.createElement("div");
    flagEditor.classList.add("flagEditor");
    document
      .querySelector("body")
      .insertAdjacentElement("afterbegin", flagEditor);
  
    const spanFlagEditor = document.createElement("span");
    spanFlagEditor.classList.add("projectRemove");
    //creation span with "i"
    spanFlagEditor.textContent = "Mode édition";
    const iconFlagEditor = document.createElement("i");
    iconFlagEditor.className = "fa-regular fa-pen-to-square";
    //input I and span 
    spanFlagEditor.insertBefore(iconFlagEditor, spanFlagEditor.firstChild);
  
    const btnFlagEditor = document.createElement("button");
    btnFlagEditor.textContent = "publier les changements";
  
    flagEditor.appendChild(spanFlagEditor);
    flagEditor.appendChild(btnFlagEditor);
    // clonage du span
    //span mode edition 
    const figure = document.querySelector("#introduction figure");
    const titleProject = document.querySelector("#portfolio > h2");
    const spanFigure = spanFlagEditor.cloneNode(true);
    const spanTitleProject = spanFlagEditor.cloneNode(true);
    spanTitleProject.classList.remove("projectRemove");
    spanTitleProject.setAttribute("id", "titleProjectRemove");
    // injection span
    figure.appendChild(spanFigure);
    titleProject.appendChild(spanTitleProject);
    
    //login to logout html
    // selection li element
    const logout = document.querySelector(
      "body > header > nav > ul > li:nth-child(3)"
    );
    //creation a element to logout
    const logoutLink = document.createElement("a");
    logoutLink.href = "./index.html";
  
    const logoutText = document.createTextNode("logout");
    logoutLink.appendChild(logoutText);
  
    logout.innerHTML = "";
    logout.appendChild(logoutLink);
    // logout
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      removeToken();
      window.location.assign("./index.html");
    });
    document.body.classList.add("marginTop");
    // delet filtre search html
    filterButtons.remove();
  };
  function openModal() {
    let deletedImages = {};
    //prevent doubles
    document.getElementById("modalGrid").innerHTML = "";
    //injection elements fetch
    // get image links
    
    const imagesUrl = [...document.querySelectorAll(".gallery img")].map((img) =>
      img.getAttribute("src")
    );
    //creation set unique links
    const imagesUrlSet = new Set(imagesUrl);
    // inejction cartes modal
    const modal = document.createElement("div");
    modal.classList.add("modal");
  
    const imageElements = [...imagesUrlSet].map((link, index) => {
      const container = document.createElement("figure");
      const img = document.createElement("img");
      const p = document.createElement("p");
      const iconDelete = document.createElement("i");
      // add attriubutes data card id
      container.setAttribute("data-card-id", cards[index].id);
      iconDelete.id = "deleteIcon";
      iconDelete.classList.add("fa-solid", "fa-trash-can", "iconModal");
      iconDelete.setAttribute("aria-hidden", "true");
      img.src = link;
      p.textContent = "éditer";
      container.appendChild(img);
      container.appendChild(p);
      container.appendChild(iconDelete);
      // add icone 
      if (index === 0) {
        const iconMove = document.createElement("i");
        iconMove.id = "moveIcon";
        iconMove.classList.add(
          "fa-solid",
          "fa-arrows-up-down-left-right",
          "iconModal"
        );
        container.appendChild(iconMove);
      }
      //Delete icon corbeille
      iconDelete.addEventListener("click", async (e) => {
        e.preventDefault();
        const cardDelete = e.target.parentNode.getAttribute("data-card-id");
        removeElement(cardDelete);
        deletedImages[cardDelete] = true;
        const deletedImagesJSON = JSON.stringify(deletedImages);
        sessionStorage.setItem("deletedImages", deletedImagesJSON);
      });
      // function delete all
      function removeElement(cardDelete) {
        const card = document.querySelector(`[data-card-id="${cardDelete}"]`);
        if (card && card.parentNode) {
          card.parentNode.removeChild(card);
          container.remove(card);
        }
      }
      const deleteALL = document.querySelector("#deleteAllWorks");
      deleteALL.addEventListener("click", () => {
        const figureModals = document.querySelectorAll("#modalGrid figure");
        const galleryModals = document.querySelectorAll("#portfolio figure");
        const deletedImages =
          JSON.parse(sessionStorage.getItem("deletedImages")) || {};
        const imageIds = [];
  
        figureModals.forEach((figure) => {
          const dataCardId = figure.getAttribute("data-card-id");
          imageIds.push(dataCardId);
          deletedImages[dataCardId] = true;
        });
        figureModals.forEach((figure) => figure.remove());
        galleryModals.forEach((figure) => figure.remove());
        sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));
      });
      return container;
    });
    const galleryMap = document.getElementById("modalGrid");
    galleryMap.append(...imageElements);
  }
  function functionDeleteWorksApi () {

    const deletedImagesJSON = sessionStorage.getItem("deletedImages");
    Object.keys(deletedImages).forEach(async (id) => {
      try {
        if (token === false) return console.log("");
  
        const response = await fetch(`${api}works/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          console.log(``);
        } else {
          throw new Error(response.statusText);
        }
      } catch (e) {
        console.error(
          `Erreur lors de la suppression de l'image avec ID ${id}: ${e}`
        );
      }
    });
  };
  //affichage modal
  function editModal() {
    const addProject = document.getElementById("editModal");
    const inputFile = document.getElementById("filetoUpload");
    const selectCategory = document.getElementById("category");
    const editSection = document.querySelector("#editSection");
    const addToApi = document.getElementById("editWorks");
    const gallerySection = document.querySelector("#modalEdit");
    const previewModal = document.querySelector("#previewModal");
    let iCanSubmit = false;
    addProject.addEventListener("click", () => {
      gallerySection.style.display = "none";
      editSection.style.display = "";
      previewModal.style.display = "initial";
    });
  
    previewModal.addEventListener("click", () => {
      gallerySection.style.display = "";
      editSection.style.display = "none";
      previewModal.style.display = "none";
    });
    // img part
    inputFile.addEventListener("change", addPicture);
    if (selectCategory.options.length === 0) {
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "";
      selectCategory.appendChild(emptyOption);
      // part category
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.textContent = category.name;
        option.setAttribute("data-id", category.id);
        selectCategory.appendChild(option);
      });
    }
    // condition post formulaire
    editSection.addEventListener("input", () => {
      const editTitle = document.querySelector("#title");
      const errorImg = document.getElementById("errorImg");
      const titleError = document.querySelector("#ErrorTitleSubmit");
      const categoryError = document.querySelector("#ErrorCategorySubmit");
      const submitForm = document.querySelector(
        "#editWorks > div.footerModal.editFooter > input[type=submit]"
      );
      iCanSubmit = false;
      titleSelected = false;
      categorySelected = false;
      submitForm.style.background = " grey";
      let category = document.querySelector("#category").value;
      const title = editTitle.value;
      const image = inputFile.files[0];
      if (image === null || image === undefined) {
        errorImg.textContent = "Veuillez selectionnez une image";
        imageSelected = false;
      } else if (title.length < 1) {
        titleError.textContent = "Ajoutez un titre";
        titleSelected = false;
      } else if (category === "") {
        categoryError.textContent = "Choisissez une catégorie";
        titleError.textContent = "";
        categorySelected = false;
      } else {
        titleError.textContent = "";
        categoryError.textContent = "";
        categorySelected = true;
        titleSelected = true;
        imageSelected = true;
      }
      if (titleSelected && categorySelected && imageSelected) {
        submitForm.style.background = " #1d6154";
        iCanSubmit = true;
      }
    });
  
    addToApi.addEventListener("submit", (e) => {
      e.preventDefault();
      // recup valeur input
      if (iCanSubmit) {
        const image = inputFile.files[0];
        const title = document.querySelector("#title").value;
        let categorySelect = document.querySelector("#category");
        let selectedOption = categorySelect.selectedOptions[0];
        let category = selectedOption.getAttribute("data-id");
        category = parseInt(category);
  
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);
        fetch(api + "works", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Ta requête POST n'est pas passé :/ ");
            }
            return response.json();
          })
          .then((data) => {
            
            fetchApiWorks();
            workDisplay();
            closeModal();
            inputFile.value = "";
          })
          .catch((error) => {
            console.error("Error:", error);
            
          });
      } else {
        console.log("");
      }
    });
  }
  // other function modal
  function disableScroll() {
    document.body.classList.add("modalOpen");
  }
  
  function enableScroll() {
    document.body.classList.remove("modalOpen");
  }
  
  function displayModal() {
    const modal = document.querySelector("#modal");
    const closeModalBtn = document.querySelector("#closeModal");
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    disableScroll();
  }
  function closeModal() {
    document.getElementById("modal").remove();
    enableScroll();
  }
  function modalHTML ()  {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <aside id="modal" class="modal" role="dialog" aria-labelledby="modalTitle" aria-hidden="true" display="initial">
  
      <div id="modalContainer">
  
        <i id="closeModal" class="fa-solid fa-xmark"></i>
        <i id="previewModal" class="fa-solid fa-arrow-left "></i>
  
        <!-- GALERIE PHOTO -->
        <section class="modalTemplate" id="modalEdit">
  
  
          <div id="editionGallery">
            <h2 class="modalTitle">Galerie photo</h2>
            <!-- <i id="deleteIcon" class="fa-solid fa-trash-can iconModal"></i>
            <i id="moveIcon" class="fa-solid fa-arrows-up-down-left-right iconModal"></i> -->
            <div id="modalGrid">
            </div>
          </div>
          <div class="footerModal">
            <hr>
            <input type="submit" value="Ajouter une photo" id="editModal">
            <p id="deleteAllWorks">Supprimer la gallerie</p>
          </div>
        </section>
  
  
        <!-- EDIT PHOTO -->
  
        <section class="modalTemplate" id="editSection" style="display:none">
  
          <h2 class="modalTitle">Ajout photo</h2>
  
          <form id="editWorks">
  
            <div id="addImageContainer">
              <i class="fa-solid fa-image"></i>
  
              <div id="inputFile">
                <label for="filetoUpload" class="fileLabel">
                  <span>+ Ajouter une photo</span>
                  <input type="file" id="filetoUpload" name="image" accept="image/png, image/jpeg"
                    class="file-input">
                </label>
              </div>
              <span class="filesize">jpg, png : 4mo max</span>
              <span id="errorImg"></span>
            </div>
  
            <div class="inputEdit" id="addTitle">
              <label for="title">Titre</label>
              <input type="text" name="title" id="title" class="inputCss" required>
              <span id="ErrorTitleSubmit" class="errormsg"></span>
            </div>
  
            <div class=" inputEdit" id="addCategory">
              <label for="category">Catégorie</label>
              <select name="category" id="category" data-id="" class="inputCss"></select>
              <span id="ErrorCategorySubmit" class="errormsg"></span>
            </div>
  
            <div class="footerModal editFooter">
              <hr>
              <input type="submit" value="Valider">
            </div>
          </form>
        </section>
  
      </div>
    </aside>
      `
    );
  };
  function addPicture () {
    const inputFile = document.getElementById("filetoUpload");
    const viewImage = document.getElementById("addImageContainer");
    const file = inputFile.files[0];
    // 4Mo en octets => Message ERROR
    const maxSize = 4 * 1024 * 1024;
  
    if (file.size > maxSize) {
      errorImg.textContent = "Votre image est trop volumineuse";
      
      return;
    }
  
    const reader = new FileReader();
  
    reader.addEventListener("load", function () {
      viewImage.innerHTML = "";
      const img = document.createElement("img");
      img.setAttribute("src", reader.result);
      viewImage.appendChild(img);
      viewImage.style.padding = "0";
    });
  
    reader.readAsDataURL(file);
  };