import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

// https://forkify-api.herokuapp.com/v2

export const state = {
  recipe: {},
  search: {
    query: '',
    recipes: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: []
}

const createRecipeObject = function (recipe) {
  const { id, title, publisher, source_url: sourceUrl, image_url: image, servings, cooking_time: cookingTime, ingredients } = recipe;
  return {
    id, title, publisher, sourceUrl, image, servings, cookingTime, ingredients,
    ...(recipe.key && { key: recipe.key })
  };
}

export const loadRecipe = async function (mainId) {
  try {
    const data = await AJAX(`${API_URL}/${mainId}?key=${KEY}`);
    state.recipe = createRecipeObject(data.data.recipe);
    // Check as if recipe is bookmarked
    state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === mainId) ? true : false;
  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.recipes = data.data.recipes.map(recipe => {
      const { id, title, publisher, image_url: image } = recipe;
      return {
        id, title, publisher, image,
        ...(recipe.key && { key: recipe.key })
      }
    });
  } catch (err) {
    throw err;
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.recipes.slice(start, end);
}

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => ingredient.quantity = ingredient.quantity * (newServings / state.recipe.servings));
  state.recipe.servings = newServings;
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmarked = true;

  persistBookmarks();
}

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;

  persistBookmarks();
}

export const restoreBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(data => data[0].startsWith('ingredient') && data[1] !== '')
      .map(ingredient => {
        const ingredientArray = ingredient[1].split(',').map(item => item.trim());
        if (ingredientArray.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)');

        const [quantity, unit, description] = ingredientArray;
        return { quantity: quantity ? Number(quantity) : null, unit, description }
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data.data.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}