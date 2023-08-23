class LabeledCheckboxElement extends HTMLElement {
  _container;
  _label;
  _input;

  static observedAttributes = ['disabled'];

  constructor() {
    super();

    this._container = document.createElement('div');

    this._label = document.createElement('label');
    this._label.innerText = `${this.innerText ?? this.getAttribute('label')}:`;
    this._container.appendChild(this._label);

    this._input = document.createElement('input');
    this._input.type = 'checkbox';
    this._input.addEventListener('change', () => this.dispatchEvent(new Event('change')));
    this._container.appendChild(this._input);

    const style = document.createElement('style');
    style.textContent = `
div {
  padding: 2px 0;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
}

input {
  cursor: pointer;
}`;
this._container.appendChild(style);

    this.attachShadow({mode: 'closed'}).appendChild(this._container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this._input.disabled = newValue === 'true';
    }
  }

  set label(value) { this._label.innerText = `${value}:`; }

  get value() { return this._input.checked; }
  set value(value) { this._input.checked = value; }
}

window.addEventListener('DOMContentLoaded', () => customElements.define('labeled-checkbox', LabeledCheckboxElement));