class SelectMultiElement extends HTMLElement {
  _value = [];

  _display;
  _dropdown;
  _options = [];

  constructor() {
    super();

    const anchor = document.createElement('span');
    anchor.classList.add('anchor');
    anchor.addEventListener('click', (e1) => {
      this._dropdown.style.marginTop = anchor.getBoundingClientRect().height + 'px';

      if (this._dropdown.style.display === 'none') {
        this._dropdown.style.display = null;
        const listener = (e2) => {
          if (e1 === e2) { return; }

          document.removeEventListener('click', listener);
          this._dropdown.style.display = 'none';
        };
        document.addEventListener('click', listener);
      }
    });

    this._display = document.createElement('span');
    this._display.classList.add('display');
    this._setDisplayText();
    anchor.appendChild(this._display);

    const downarrow = document.createElement('span');
    downarrow.innerText = '⏷';
    anchor.appendChild(downarrow);

    this._dropdown = document.createElement('div');
    this._dropdown.classList.add('dropdown');
    this._dropdown.style.display = 'none';
    this._dropdown.addEventListener('click', (e) => e.stopPropagation());
    anchor.appendChild(this._dropdown);

    const style = document.createElement('style');
    style.textContent = `
.anchor {
  display: flex;
  width: fit-content;
  height: fit-content;
  border: 1px solid black;
  border-radius: 5px;
  position: relative;
}

.anchor > .display {
  padding: 2px;
}

.dropdown {
  position: absolute;
  z-index: 9999;
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
  width: fit-content;
  min-width: 100%;
  right: 0;
}

.dropdown > div {
  width: 100%;
  height: fit-content;
}`;
    anchor.appendChild(style);

    this.attachShadow({mode: 'closed'}).appendChild(anchor);
  }

  _setDisplayText() {
    this._display.innerText = `Selected: ${this._value.length}`;
  }

  set options(options) {
    for (const option of options) {
      const checkbox = document.createElement('labeled-checkbox');
      checkbox.label = option.display;
      checkbox.code = option.code;
      checkbox.value = this._value.includes(checkbox.code);
      checkbox.addEventListener('change', () => {
        const shouldBeSelected = checkbox.value;
        const isSelected = this._value.includes(checkbox.code);

        if (isSelected && !shouldBeSelected) {
          this._value.splice(this._value.indexOf(checkbox.code), 1);
        } else if (!isSelected && shouldBeSelected) {
          this._value.push(checkbox.code);
          this._value.sort((a, b) => {
            a = options.find(x => x.code === a).display;
            b = options.find(x => x.code === b).display;
            return a.localeCompare(b);
          });
        }

        this._setDisplayText();
      });
      this._options.push(checkbox);
      this._dropdown.appendChild(checkbox);
    }
  }

  get value() { return this._value; }
  set value(value) {
    this._value = value;
    for (const option of this._options) {
      option.value = this._value.includes(option.code);
    }

    this._setDisplayText();
  }
}

window.addEventListener('DOMContentLoaded', () => customElements.define('select-multi', SelectMultiElement));