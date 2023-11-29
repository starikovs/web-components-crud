import 'components/add-or-edit.component.mjs';
import userService, { USER_EDIT_EVENT } from 'services/user.service.mjs';

const template = document.createElement('template');

template.innerHTML = `
  <style>app-add-or-edit-container { display: block }</style>
  <app-add-or-edit data-id="" data-nickname="" data-email=""></app-add-or-edit>
`;

class AddOrEditContainerComponent extends HTMLElement {
  user = null;

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

  disconnectedCallback() {
    this.unsubscribe();
  }

  render(id = '', nickname = '', email = '') {
    if (this.host.children.length) {
      const el = this.host.querySelector('app-add-or-edit');

      el.setAttribute('data-id', id);
      el.setAttribute('data-nickname', nickname);
      el.setAttribute('data-email', email);
    } else {
      this.host.appendChild(template.content.cloneNode(true));
    }
  }

  subscribe() {
    const addOrEditElement = this.host.querySelector('app-add-or-edit');

    addOrEditElement.addEventListener(
      'addOrEdit',
      (this.addOrEditHandler = (event) => {
        const user = event.detail;

        if (user.id) {
          userService.updateUser(event.detail);
          this.render();
        } else {
          userService.addUser(event.detail);
        }
      })
    );

    addOrEditElement.addEventListener(
      'cancel',
      (this.cancelHandler = (event) => {
        const user = event.detail;
        userService.updateUser(user);
        this.render();
      })
    );

    this.userEditEventHandler = (user) => {
      this.render(user.id || '', user.nickname, user.email);
    };

    userService.subscribe(USER_EDIT_EVENT, this.userEditEventHandler);
  }

  unsubscribe() {
    // TODO: implement
  }

  setAppAddOrEditAttributes(id, nickname, email) {}
}

customElements.define('app-add-or-edit-container', AddOrEditContainerComponent);
