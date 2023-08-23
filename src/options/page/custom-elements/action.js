class ActionElement extends HTMLElement {
  _legend;
  _active;
  _languages;

  constructor() {
    super();

    const container = document.createElement('fieldset');

    this._legend = document.createElement('legend');
    this._legend.innerText = this.getAttribute('legend');
    container.appendChild(this._legend);

    this._active = document.createElement('labeled-checkbox');
    this._active.label = 'Active';
    container.appendChild(this._active);

    this._languages = document.createElement('labeled-select-multi');
    this._languages.innerText = 'Languages';
    this._languages.options;
    container.appendChild(this._languages);

    this.attachShadow({mode: 'closed'}).appendChild(container);
  }

  set legend(value) { this._legend.innerText = value; }

  get data() {
    return {
      active: this._active.value,
      languages: this._languages.value,
    };
  }

  set data(value) {
    this._active.value = value.active;
    this._languages.value = value.languages;
  }

  set languages(value) { this._languages.options = value; }
}

window.addEventListener('DOMContentLoaded', () => customElements.define('action-element', ActionElement));