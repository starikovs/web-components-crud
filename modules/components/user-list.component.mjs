import 'components/user.component.mjs';
import userService, { USERS_CHANGED_EVENT } from 'services/user.service.mjs';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    app-user-list {
      display: block;
    }

    app-user-list .editing {
      background: orange;
    }    
  </style>
  <ul class="list-group">
  </ul>
`;

const itemTemplate = document.createElement('template');

itemTemplate.innerHTML = `
  <li class="list-group-item">
    <app-user id="" data-id="" data-nickname="" data-email=""></app-user>
  </li>
`;

class UserListComponent extends HTMLElement {
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
    this.render(true);
  }

  disconnectedCallback() {
    this.unsubscribe();
  }

  render(isFirstRender = false) {
    if (isFirstRender) {
      this.host.appendChild(template.content.cloneNode(true));
    }

    this.unsubscribe();

    const ul = this.host.querySelector('ul');

    ul.innerHTML = '';

    userService.users.forEach((user, index) => {
      const itemEl = itemTemplate.content.cloneNode(true);
      const appUserEl = itemEl.querySelector('app-user');

      appUserEl.setAttribute('id', `app-user-${index}`);
      appUserEl.setAttribute('data-id', user.id);
      appUserEl.setAttribute('data-nickname', user.nickname);
      appUserEl.setAttribute('data-email', user.email);

      if (user.editingInProgress) {
        itemEl.firstElementChild.classList.add('editing');
      }

      ul.appendChild(itemEl);
    });

    this.subscribe();
  }

  subscribe() {
    const appUserElements = this.host.querySelectorAll('app-user');

    this.appUserEditHandler = (event) => {
      userService.editUser(event.detail);
    };

    this.appUserDeleteHandler = (event) => {
      userService.deleteUser(event.detail);
    };

    appUserElements.forEach((el) => {
      el.addEventListener('edit', this.appUserEditHandler);
      el.addEventListener('delete', this.appUserDeleteHandler);
    });

    this.usersChangedEventHandler = (users) => {
      this.render();
      console.log('_debug UserListComponent users refreshed', users);
    };

    userService.subscribe(USERS_CHANGED_EVENT, this.usersChangedEventHandler);
  }

  unsubscribe() {
    const appUserComponents = this.host.querySelectorAll('app-user');

    appUserComponents.forEach((component) => {
      if (this.appUserEditHandler) {
        component.removeEventListener('edit', this.appUserEditHandler);
      }

      if (this.appUserDeleteHandler) {
        component.removeEventListener('delete', this.appUserDeleteHandler);
      }
    });

    this.appUserEditHandler = null;
    this.appUserDeleteHandler = null;

    userService.unsubscribe(USERS_CHANGED_EVENT, this.usersChangedEventHandler);
    this.usersChangedEventHandler = null;
  }
}

customElements.define('app-user-list', UserListComponent);
