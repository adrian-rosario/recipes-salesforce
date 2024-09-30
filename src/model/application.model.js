import * as constants from "../config/constants.js";
import * as helpers from "../helpers/helpers.js";

export const state = {
  recipe: {},
  search: {},
  resultsPerPage: constants.RESULTS_PER_PAGE,
  defaultPage: 1,
  bookmarks: [],
};

const assignRecipeObject = function (data, hashId) {
  // used when loading recipes
  // used after a recipe has been successfully added to the api
  let { recipe } = data.data;
  return {
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    title: recipe.title,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    id: hashId,
    // conditionally add properties
    // && short circuits, if falsy, nothing happens
    // if there is a value, the second part of operator is returned
    // spread puts the value there
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (hashId) {
  try {
    if (!hashId) return; // guard

    const data = await helpers.getJson(hashId);

    state.recipe = assignRecipeObject(data, hashId);
    // let { recipe } = data.data;
    // state.recipe = {
    //   publisher: recipe.publisher,
    //   ingredients: recipe.ingredients,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   title: recipe.title,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   id: hashId,
    // };

    // set bookmark from saved recipes, so when we return to a saved recipe
    // our css class will get assigned correctly and render as an active bookmark
    if (this.state.bookmarks.some((theBookmark) => theBookmark.id === hashId))
      this.state.recipe.bookmarked = true;
    else this.state.recipe.bookmarked = false;
    //
  } catch (err) {
    throw err;
  }
};

export const searchRecipe = async function (query) {
  if (!query) return;
  try {
    const data = await helpers.getSearchJson(query);
    let { recipes } = data.data;

    recipes = recipes.map((entry) => {
      return {
        id: entry.id,
        title: entry.title,
        publisher: entry.publisher,
        image: entry.image_url,
      };
    });

    state.search = recipes;
    state.defaultPage = 1;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSearchResultsSegment = function (page = state.defaultPage) {
  // if (!state.search) helpers.log("no state search!");
  // setting default value

  if (!this.state.search.length) return;

  state.defaultPage = page; // value we'd need to assign no matter what
  const start = (page - 1) * state.resultsPerPage;
  const end = page * state.resultsPerPage;

  return state.search.slice(start, end);
};

export const updateServings = function (changeServings) {
  state.recipe.ingredients.forEach((entry) => {
    entry.quantity =
      (entry.quantity * changeServings) / this.state.recipe.servings;
  });
  state.recipe.servings = changeServings;
};

export const addBookmark = function (recipe) {
  this.state.bookmarks.push(recipe);

  // add new property to recipe setting a bookmared value
  if (recipe.id === this.state.recipe.id) {
    this.state.recipe.bookmarked = true;
  }
  persistToLocalStorage();
};

export const removeBookmark = function (theId) {
  const theIndex = this.state.bookmarks.findIndex(
    (entry) => entry.id === theId
  );
  this.state.bookmarks.splice(theIndex, 1);
  // no longer a bookmark, negate the flag
  if (theId === this.state.recipe.id) this.state.recipe.bookmarked = false;
  persistToLocalStorage();
};

const persistToLocalStorage = function () {
  helpers.log("model, bookmarks?", state.bookmarks);
  localStorage.setItem("recipeBookmarks", JSON.stringify(state.bookmarks));
};

export const addRecipe = async function (newRecipe) {
  try {
    // take raw input data, transform to what is
    // consistent w/ api
    // ie. the ingredients in the form are not in an array
    // also, separate from the string quantity, unit, ingredient
    // ie. 0.5, kg, rice
    // TODO:
    // ie. salt
    // ie. 1, avocado
    const ingredientArray = Object.entries(newRecipe)
      // we only want the form items beginning w/ 'ingredient'
      // also, ignore empty input fields

      .filter(
        (eachIngredient) =>
          // key: eachIngredient[0]
          // value: eachIngredient[1]
          eachIngredient[0].startsWith("ingredient") && eachIngredient[1] !== ""
      )
      // take each of those ingredients, and handle the strings
      // remove white space, split by comma
      .map((ingredientString) => {
        const ingredientStringArray = ingredientString[1]
          .replaceAll(" ", "")
          .split(",");

        if (ingredientStringArray.length !== 3)
          throw new Error("Please enter values as: amount, unit, ingredient");

        const [quantity, unit, description] = ingredientStringArray; // we want the value

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const newRecipeObject = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredientArray,
    };

    // const returnedData = await helpers.sendJson(
    //   `${constants.API_URL}?key=${constants.API_KEY}`,
    //   newRecipeObject
    // );
    // TODO: assign to current recipe in view from data return after
    // successful post
    // state.recipe = assignRecipeObject(returnedData, returnedData.id);
    // addbookmark(state.recipe)

    // helpers.log("💥 model - ingredientArray", ingredientArray);
    helpers.log("💥 model - newRecipeObject", newRecipeObject);
    helpers.log("💥 model - returnedData", returnedData);
  } catch (error) {
    throw error;
  }
};

// bc we want to utilize the locally stored bookmarks
const init = function () {
  const locallyStoredBookmarks = localStorage.getItem("recipeBookmarks");

  if (locallyStoredBookmarks.length) {
    // helpers.log(`current bookmarks: ${JSON.stringify(state.bookmarks)}`);

    state.bookmarks = JSON.parse(locallyStoredBookmarks);
  }
};
init();
