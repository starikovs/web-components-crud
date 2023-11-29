import { createEmptyUser } from '../models/user.model.mjs';

const template = document.createElement('template');

template.innerHTML = `
  <style>app-add-or-edit { display: block; }</style>

  <h1>Header text</h1>

  <form>
    <div class="mb-3">
      <label for="nickname-input" class="form-label">User nickname</label>
      <input
        type="text"
        required
        placeholder="User nickname"
        class="form-control nickname-input"
        id="nickname-input">
    </div>

    <div class="mb-3">
      <label for="email-input" class="form-label">User email</label>
      <input
        type="email"
        required
        placeholder="User email"
        class="form-control email-input"
        id="email-input">
    </div>

    <button type="submit" class="btn btn-primary">
      Add / Edit
    </button>
    <button
      type="reset"
      class="btn btn btn-outline-secondary ms-3"
    >
      Cancel
    </button>
  </form>
`;

class AddOrEditComponent extends HTMLElement {
  user = null;

  static observedAttributes = ['data-nickname', 'data-email', 'data-id'];

  get host() {
    // to use shadow dom:
    // return this.shadowRoot;

    return this;
  }

  get nicknameInput() {
    return this.host.querySelector('.nickname-input');
  }

  get emailInput() {
    return this.host.querySelector('.email-input');
  }

  constructor() {
    super();

    // to use shadow dom:
    // this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.subscribe();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.host.children.length) {
      this.render();
    }
  }

  render() {
    if (!this.host.children.length) {
      this.host.appendChild(template.content.cloneNode(true));
    }

    const nickname = this.getAttribute('data-nickname');
    const email = this.getAttribute('data-email');
    const id = this.getAttribute('data-id');
    const headerEl = this.host.querySelector('h1');
    const btn = this.host.querySelector('button[type="submit"]');

    headerEl.innerText = id ? `Editing user ${nickname}` : 'Add new user';
    btn.innerText = id ? 'Edit' : 'Add';

    this.nicknameInput.value = nickname || '';
    this.emailInput.value = email || '';

    this.user = createEmptyUser(nickname, email);

    if (id) {
      this.user.id = parseInt(id, 10);
    }
  }

  subscribe() {
    const form = this.host.querySelector('form');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent('addOrEdit', {
          detail: {
            ...this.user,
            nickname: this.nicknameInput.value,
            email: this.emailInput.value,
          },
          bubbles: false,
          composed: false,
        })
      );
      this.host.querySelector('form').reset();
      this.host.querySelector('.nickname-input').focus();
    });

    const cancelButton = this.host.querySelector('button[type="reset"]');

    cancelButton.addEventListener('click', (event) => {
      if (this.user.id) {
        event.preventDefault();

        const nickname = this.nicknameInput.value;
        const email = this.emailInput.value;

        if (nickname === this.user.nickname && email === this.user.email) {
          this.dispatchEvent(
            new CustomEvent('cancel', {
              detail: this.user,
              bubbles: false,
              composed: false,
            })
          );
        } else {
          this.nicknameInput.value = this.user.nickname;
          this.emailInput.value = this.user.email;
        }
      }
    });
  }
}

customElements.define('app-add-or-edit', AddOrEditComponent);
