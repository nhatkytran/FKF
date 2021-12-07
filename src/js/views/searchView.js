class SearchView {
  _parentElement = document.querySelector('.search');
  _inputElement = this._parentElement.querySelector('.search__field');

  getQuery() {
    const query = this._inputElement.value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._inputElement.value = '';
    this._inputElement.blur();
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();