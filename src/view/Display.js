import { Fraction } from "fractional";
import * as helpers from "../helpers/helpers.js";

export default class Display {
  parentDiv = document.querySelector(".recipe");
  _data;

  renderSpinner() {
    // helpers.log("DisplayRecipe class, render spinner");

    this._clearContainer();
    this._insertSpinnerMarkup();
  }

  addHandlerRender(handler) {
    const listeners = ["hashchange", "load"];

    listeners.map((listener) => {
      window.addEventListener(listener, handler);
    });
  }

  addHandlerBookmark(handler) {
    this.parentDiv.addEventListener("click", function (e) {
      const theButton = e.target.closest(".bookmarker");
      if (!theButton) return;
      handler();
    });
  }

  render(data, renderFlag = true) {
    // helpers.log("DisplayRecipe class, render");

    this._data = data;
    const markup = this.generateMarkup();

    // so we can utilize the subclass which has the isolated
    // responsibiliy of returning a list of recipe buttons
    if (!renderFlag) {
      return markup;
    }

    this._clearContainer();
    this.parentDiv.insertAdjacentHTML("afterbegin", markup);
  }

  //
  updateRecipeDomNodeText(data) {
    // helpers.log("DisplayRecipe class, updateRecipeDomNodeText");

    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError("Update DOM has no data");

    this._data = data;
    // compare the text and data attribute changes
    // update only those changes in the DOM
    // helpers.log("do we have data?", this._data);
    const markupGenerated = this.generateMarkup();

    // helpers.log("markup generated", markupGenerated);

    // create dom from string and keep in memory
    const newDomCache = document
      .createRange()
      .createContextualFragment(markupGenerated);

    const arrayFromGeneratedMarkup = Array.from(
      newDomCache.querySelectorAll("*")
    );

    // helpers.log(`arrayFromGeneratedMarkup ${arrayFromGeneratedMarkup}`);

    const arrayFromExistingPageMarkup = Array.from(
      this.parentDiv.querySelectorAll("*")
    );

    arrayFromGeneratedMarkup.forEach((newElement, index) => {
      const oldElement = arrayFromExistingPageMarkup[index];

      // update text
      if (
        !newElement.isEqualNode(oldElement) /* compare the nodes */ &&
        newElement.firstChild?.nodeValue !== "" && // make sure the value isn't blank
        newElement.firstChild?.nodeValue !== undefined
      ) {
        oldElement.firstChild.textContent = newElement.firstChild.textContent;
      }

      // helpers.log(`🔥 ${newElement.closest("button").className}`);

      // update attributes
      if (!newElement.isEqualNode(oldElement)) {
        // helpers.log(`🔥 dataset ${JSON.stringify(newElement.dataset)}`);
        // helpers.log(`🤡 dataset ${JSON.stringify(oldElement.dataset)}`);

        oldElement.dataset.updateTo = newElement.dataset.updateTo;
      }
    });
  }

  scrollToPageTop() {
    window.scrollTo({ top: 0, behavior: "smooth" }); // not ideal solution, works for now
  }

  renderError(message) {
    helpers.log("Display class, renderError");

    this._clearContainer();
    const markup = `
      <div class="error">
        <h3>We're sorry, there was an error.</h3>
        <p>${message}</p>
      </div>
    `;
    this.parentDiv.insertAdjacentHTML("afterbegin", markup);
  }

  _insertSpinnerMarkup() {
    const markup = `<div class="spinner">
            <svg>
              <use href="icons.21bad73c.svg#icon-loader"></use>
            </svg>
          </div>`;
    this.parentDiv.insertAdjacentHTML("afterbegin", markup);
  }

  _clearContainer() {
    this.parentDiv.innerHTML = "";
  }

  generateMarkup() {
    let listItems = [];
    const iconsPath = "icons.21bad73c.svg";
    const recipeTitle = this._data.title;

    if (!this._data.ingredients) {
      helpers.log("no recipe");
      return;
    }

    this._data.ingredients.map((item) => {
      listItems.push(
        `<li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${iconsPath}#icon-check"></use>
          </svg>
 
          <div class="recipe__quantity">
           ${item.quantity ? new Fraction(item.quantity).toString() : ""}
          </div>
 
          <div class="recipe__description">
          
           <span class="recipe__unit">${item.unit}</span>

           <span>${item.description}</span>
          </div>
          </li>`
      );
    });

    const listItemsHtml = `<div class='servings'>Servings 
      ${this._data.servings}, 
      Cooking Time: 
      ${this._data.cookingTime}</div>
      <div class='portions'>Portion Control: 
      <button data-update-to="${
        +this._data.servings + 1
      }" class="increment"><span class="offScreen">Increase</span></button> 
      <button data-update-to="${
        this._data.servings - 1
      }" class="decrement"><span class="offScreen">Decrease</span></button>
      <button class='bookmarker' data-update-to="${
        this._data.bookmarked ? "bookmarked" : ""
      }"><span class="offScreen">Bookmark Recipe</span></button>
      </div>      

      <ul>
        ${listItems.join("")}
      </ul>`;
    const markup = `<h3>${recipeTitle}</h3><ul>${listItemsHtml}</ul>`;
    return markup;
  }
}
