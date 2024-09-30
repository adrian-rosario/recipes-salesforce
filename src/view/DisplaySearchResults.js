import Display from "./Display.js";
import * as helpers from "../helpers/helpers.js";
import DisplayRecipesList from "./DisplayRecipesList.js";

class DisplaySearchResults extends Display {
  parentDiv = document.querySelector(".searchResults");

  generateMarkup() {
    // helpers.log("any data?", this._data);

    let listItems = [];
    let markup;

    // const pageIdInUrl = window.location.hash.slice(1);
    // helpers.log("pageIdInUrl " + pageIdInUrl);

    if (!this._data) return;

    if (this._data) {
      this._data.map((eachDataItem) => {
        //     // helpers.log("💥💥💥💥 display search results", eachDataItem);

        // set render to false so that instead of inserting to the dom
        // the render method returns html, markup is sent back as a string

        let returnedMarkup = DisplayRecipesList.render(eachDataItem, false);
        // helpers.log("😡💥💥💅 display search results", returnedMarkup);
        listItems.push(returnedMarkup);
      });
    }

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

    markup = `<ul>
          ${listItems.join("")}
        </ul>`;

    this.parentDiv.addEventListener("click", (e) => {
      helpers.log(
        `e.target.closest("button")`,
        e.target.closest("button").dataset.id
      );
      this.searchResultClick(e.target.closest("button").dataset.recipeNumber);
    });

    return markup;
  }

  searchResultClick(e) {
    const resultId = e;
    if (!resultId) return;
    window.location.hash = resultId;
    // this.scrollToPageTop();
  }
}

export default new DisplaySearchResults();
