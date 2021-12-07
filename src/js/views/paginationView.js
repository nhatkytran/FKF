import View from "./View.js";
import { prevPage, nextPage } from '../helpers.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagiantion(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    })
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.recipes.length / this._data.resultsPerPage);
    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `${nextPage(curPage)}`;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `${prevPage(curPage)}`;
    }

    // Other page
    if (curPage < numPages) {
      return `
        ${prevPage(curPage)}
        ${nextPage(curPage)}
      `;
    }

    // Page 1 and there are NO other pages
    return '';
  }
}

export default new PaginationView();