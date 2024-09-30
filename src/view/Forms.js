import * as helpers from "../helpers/helpers.js";

class Forms {
  _searchResultsContainer = document.querySelector(".searchResults");

  clearInput() {
    document.querySelector("#searchInput").value = "";
  }

  handleFormClick(handler) {
    document.querySelector("#theForm").addEventListener("submit", (e) => {
      helpers.log("form clicked");
      handler(); // call the method passed in from the controller
      e.preventDefault();
    });
  }

  getQuery() {
    const query = document.querySelector("#searchInput").value;
    this.clearSearchResults();
    return query;
  }

  clearSearchResults() {
    helpers.log("clear search results called");
    this._searchResultsContainer.innerHTML = "";
  }
}

export default new Forms();
