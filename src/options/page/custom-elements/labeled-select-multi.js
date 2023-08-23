class LabeledSelectMultiElement extends HTMLElement {
  _label;
  _select;

  constructor() {
    super();

    const container = document.createElement('div');

    this._label = document.createElement('label');
    this._label.innerText = `${this.innerText}:`;
    container.appendChild(this._label);

    this._select = document.createElement('select-multi');
    container.appendChild(this._select);

    const style = document.createElement('style');
    style.textContent = `div { padding: 6px 0; } select-multi { float: right; }`;
    container.appendChild(style);

    this.attachShadow({mode: 'closed'}).appendChild(container);
  }

  set innerText(value) {
    this._label.innerText = `${value}:`;
  }

  set options(options) { this._select.options = options; }
  get value() { return this._select.value; }
  set value(value) { this._select.value = value; }
}

window.addEventListener('DOMContentLoaded', () => customElements.define('labeled-select-multi', LabeledSelectMultiElement));