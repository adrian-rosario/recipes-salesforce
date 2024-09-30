import * as model from "../model/application.model.js";
import DisplayHome from "../view/DisplayHome.js";
import DisplaySearchResults from "../view/DisplaySearchResults.js";
import Forms from "../view/Forms.js";
import Pagination from "../view/Pagination.js";
// import * as helpers from "../helpers/helpers.js";
import DisplayBookmarks from "../view/DisplayBookmarks.js";
import DisplayAddRecipe from "../view/DisplayAddRecipe";
// import * as constants from "../config/constants.js";

// parce
if (module.hot) {
  module.hot.accept();
}

const initialLoad = async function () {
  // helpers.log("home controller, initial load");

  try {
    const urlId = window.location.hash.slice(1);

    if (!urlId) return; // guard

    // display recipe view spinner
    DisplayHome.renderSpinner();

    // render data- attribute updates in search results
    DisplaySearchResults.updateRecipeDomNodeText(
      model.getSearchResultsSegment()
    );

    // update bookmarks, so highlighted class will be applied
    // for the recipe currently displayed
    if (model.state.bookmarks.length) {
      DisplayBookmarks.updateRecipeDomNodeText(model.state.bookmarks);
    }

    await model.loadRecipe(urlId);
    const { recipe } = model.state;

    DisplayHome.render(recipe);
  } catch (err) {
    DisplayHome.renderError(err);
  }
};

const handleSearch = async function () {
  // helpers.log("home controller, handle search");

  try {
    const query = Forms.getQuery();

    if (!query) return;

    await model.searchRecipe(query);

    Forms.clearInput();
    DisplaySearchResults.renderSpinner();
    DisplaySearchResults.render(model.getSearchResultsSegment());
    Pagination.render(model.state);
    //
  } catch (error) {
    throw new Error(error.message);
  }
};

const paginationEvent = function (dataNumber) {
  DisplaySearchResults.render(model.getSearchResultsSegment(+dataNumber));
  Pagination.render(model.state);
};

const servingsControl = function (newServings) {
  model.updateServings(newServings);
  const { recipe } = model.state;

  DisplayHome.updateRecipeDomNodeText(recipe);
};

const handleBookmark = function () {
  // if no bookmark, add it, else remove it by the id
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  DisplayHome.updateRecipeDomNodeText(model.state.recipe);
  DisplayBookmarks.render(model.state.bookmarks);
  DisplayBookmarks.updateRecipeDomNodeText(model.state.bookmarks);
};

const handleBookmarksList = function () {
  DisplayBookmarks.render(model.state.bookmarks);
  DisplayBookmarks.updateRecipeDomNodeText(model.state.bookmarks);
};

const handleAddRecipe = async function (newRecipeData) {
  try {
    // display loading spinner
    await model.addRecipe(newRecipeData);
    // render new recipe
    // DisplayHome.render(model.state.recipe);
    // display success message
    // .renderMessage
    // close form window
    // setTimeout(
    //   () => DisplayAddRecipe.toggleFormDisplay(),
    //   constants.FORM_CLOSE_SEC
    // );
    // DisplayAddRecipe.toggleFormDisplay();
  } catch (error) {
    DisplayAddRecipe.renderError(error.message);
  }
};

const init = function () {
  DisplayBookmarks.addRecipesListHandler(handleBookmarksList);
  DisplayHome.addHandlerRender(initialLoad);
  Forms.handleFormClick(handleSearch);
  Pagination.addHandler(paginationEvent);

  DisplayHome.addHandleUpdateServings(servingsControl);
  DisplayHome.addHandlerBookmark(handleBookmark);
  DisplayAddRecipe.addUploadHandler(handleAddRecipe);
};
init();
