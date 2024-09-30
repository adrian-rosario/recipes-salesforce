import Display from "./Display.js";
import * as helpers from "../helpers/helpers.js";

class DisplayRecipesList extends Display {
  /**
   * DisplayBookmarks and DisplaySearchResults (before this change) generate the same HTML list/buttons
   * in order to reduce code repetition, this class will generate HTML which will then be used in
   * both of those classes (after some refactoring)
   * DisplayRecipesList will then become a child view of the other two views
   *
   * A second parameter must be added to the parent class in order that we can
   * pass in a "render" flag
   */
  parentDiv = "";

  generateMarkup() {
    // helpers.log(" 😈 DisplayRecipesList - any data?", this._data);

    if (!this._data) return;

    const pageIdInUrl = window.location.hash.slice(1);
    const markup = `
      <li>
        <button 
        data-recipe-number=${this._data.id}
        data-update-to="${pageIdInUrl === this._data.id ? "true" : ""}">
          <div>
            <img src="${this._data.image}" alt="${this._data.title}" />
          </div>
          <div class="description">
            <h4>
              ${this._data.title}
            </h4>
            ${this._data.publisher}
          </div>
        </button>
      </li>
    `;

    // helpers.log(` 😈 DisplayRecipesList - markup ${markup}`);

    // let listItems = [];

    // const pageIdInUrl = window.location.hash.slice(1);
    // helpers.log("DisplayRecipesList - pageIdInUrl " + pageIdInUrl);

    // if (!this._data) return;

    // this._data.map((item) => {
    //   const theId = item.id;

    //   listItems.push(
    //     `<li>
    //       <button
    //       data-recipe-number=${theId}
    //       data-update-to="${pageIdInUrl === theId ? "true" : ""}">
    //         <div>
    //           <img src="${item.image}" alt="${item.title}" />
    //         </div>
    //         <div class="description">
    //           <h4>
    //             ${item.title}
    //           </h4>
    //           ${item.publisher}
    //         </div>
    //       </button>
    //     </li>`
    //   );
    // });

    // const markup = `<ul>
    //       ${listItems.join("")}
    //     </ul>`;

    // this.parentDiv.addEventListener("click", (e) => {
    //   helpers.log(
    //     `DisplayRecipesList e.target.closest("button")`,
    //     e.target.closest("button").dataset.id
    //   );
    //   this.searchResultClick(e.target.closest("button").dataset.recipeNumber);
    // });

    return markup;
  }
}
export default new DisplayRecipesList();
