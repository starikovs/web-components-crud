import { createEmptyUser } from '../models/user.model.mjs';

const template = document.createElement('template');

template.innerHTML = `
  <span class="app-user-nickname"></span>
  ( <span class="app-user-email"></span> )
  <a href="#" class="app-user-edit">edit</a> | 
  <a href="#" class="app-user-delete">delete</a>
`;

class UserComponent extends HTMLElement {
  user = null;

  static observedAttributes = ['data-nickname', 'data-email', 'data-id'];

  get host() {
    // to use shadow dom:
    // return this.shadowRoot;

    return this;
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

    this.host.querySelector('.app-user-nickname').innerText = nickname;
    this.host.querySelector('.app-user-email').innerText = email;

    this.user = createEmptyUser(nickname, email);
    this.user.id = parseInt(this.getAttribute('data-id'), 10);
  }

  subscribe() {
    const editLink = this.host.querySelector('.app-user-edit');
    const deleteLink = this.host.querySelector('.app-user-delete');

    editLink.addEventListener('click', (event) => {
      event.preventDefault();

      this.dispatchEvent(
        new CustomEvent('edit', {
          detail: this.user,
          bubbles: false,
          composed: false,
        })
      );
    });

    deleteLink.addEventListener('click', (event) => {
      event.preventDefault();

      this.dispatchEvent(
        new CustomEvent('delete', {
          detail: this.user,
          bubbles: false,
          composed: false,
        })
      );
    });
  }
}

customElements.define('app-user', UserComponent);
