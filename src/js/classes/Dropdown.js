import { SIZES } from '../constants';

export class Dropdown {
  constructor(size = 4, itemCb = function() {}) {
    this.itemCallback = itemCb;
    this.sizes = SIZES;
    this.currentSize = SIZES.find((s) => s === size);
    this.dropdownContainer = document.querySelector('.dropdown');
  }

  setDropdownValue(size) {
    this.currentSize = size;
    this.render();
  }

  toggleDropdown(element) {
    element.currentTarget.classList.toggle('dropdown--open')
  }

  render() {
    const data = this.sizes.filter((el) => el !== this.currentSize);
    const currentValue = this.currentSize;

    const html = `
      <div class="dropdown-wrapper">
        <div class="dropdown-value" data-value="${currentValue}">
          ${currentValue}x${currentValue}
        </div>
          ${data
            .sort((a, b) => a - b)
            .map((size) =>
              `<div class="dropdown-item" data-size="${size}">
                ${size}x${size}
              </div>`)
            .join(" ")}
      </div>`;

    this.dropdownContainer.innerHTML = html;
    const dropdownWrapper = document.querySelector('.dropdown-wrapper')

    // Attach event listeners
    document.addEventListener('click', (e) => {
      if (!dropdownWrapper.contains(e.target) && dropdownWrapper.classList.contains('dropdown--open')) {
        dropdownWrapper.classList.remove('dropdown--open')
      }
    })
    dropdownWrapper.addEventListener('click', this.toggleDropdown.bind(this));
    this.dropdownContainer.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (event) => {
        const size = parseInt(event.target.getAttribute('data-size'), 10);
        this.setDropdownValue(size);
        this.itemCallback(size);
      });
    });
  }
}