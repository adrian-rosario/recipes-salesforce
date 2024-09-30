import Display from "./Display";
import * as helpers from "../helpers/helpers.js";

class Pagination extends Display {
  parentDiv = document.querySelector(".pagination");

  addHandler(handler) {
    this.parentDiv.addEventListener("click", (e) => {
      const theTarget = e.target.closest("button");
      if (!theTarget) return;

      // helpers.log("pagination dataset", theTarget.dataset.goto);

      const buttonAction = theTarget.dataset.goto;
      handler(buttonAction);
    });
  }

  generateMarkup() {
    // helpers.log("pagination, generate markup");
    let markup;

    // iterations:
    //  page 1, there are other pages
    //  page 1, there no other pages
    //  last page
    //  other page
    const currentPage = this._data.defaultPage;

    // helpers.log("Pagination view, data length", this._data.search.length);

    const numberOfPages = Math.ceil(
      this._data.search.length / this._data.resultsPerPage
    );
    // round to highest whole number

    // helpers.log("number of pages", numberOfPages);
    // helpers.log("current page", currentPage);

    if (currentPage === 1 && numberOfPages > 1) {
      // helpers.log("📓 page 1 and others");
      markup = `<div class='buttonsContainer'>
        <div class="pageCount">Page ${currentPage} of ${numberOfPages}</div>
        <div>
        <button data-goto=${
          currentPage + 1
        } class='forward'><span class="offScreen">forward</span></button></div>
      </div>`;
    }

    if (currentPage === numberOfPages && numberOfPages > 1) {
      // helpers.log("📓 last page");

      markup = `<div class='buttonsContainer'>
        <div class="pageCount">Last Page</div> 
        <div><button data-goto=${
          currentPage - 1
        } class='back'><span class="offScreen">back to page ${
        currentPage - 1
      }</span></button></div>
      </div>`;
    }

    if (currentPage !== 1 && currentPage < numberOfPages) {
      // helpers.log("📓 other page");

      markup = `<div class='buttonsContainer'>
        <div class="pageCount">Page ${currentPage} of ${numberOfPages}</div>
        <div>
        <button  data-goto=${
          currentPage - 1
        } class='back'><span class="offScreen">back</span></button></div>
        <div><button  data-goto=${
          currentPage + 1
        } class='forward'><span class="offScreen">forward</span></button></div>
      </div>`;
    }

    if (currentPage === 1 && numberOfPages === 1) {
      markup = "";
    }

    return markup;
  }
}

export default new Pagination();
