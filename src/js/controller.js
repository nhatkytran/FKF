import * as model from './model.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { FIRST_PAGE, CLOSE_MODAL_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { setTimeout } from 'core-js';

const controlRecipes = async function () {
  try {
    const mainId = window.location.hash.slice(1);
    if (!mainId) return;
    recipeView.renderSpinner();

    // Selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // Fetch API recipe
    await model.loadRecipe(mainId);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query || query === '') throw new Error('Pleae try again');

    // Fetch API search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage(FIRST_PAGE));

    // Render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError(err);
  }
}

const controlPagiantion = function (goToPage) {
  // Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render pagination
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
  // recipeView.render(model.state.recipe);
}

const controlAddBookmark = function () {
  // Add / Remove bookmark
  !model.state.recipe.bookmarked ? model.addBookmark(model.state.recipe) : model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);

    //Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err);
  }
}

// Init => Subscriber - Publisher => Listen events => MVC
const init = function () {
  // Get data from local storage and render bookmarks
  model.restoreBookmarks();
  bookmarksView.addEventHandler(controlBookmarks);
  // In Use
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagiantion(controlPagiantion);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Please');
}
init();