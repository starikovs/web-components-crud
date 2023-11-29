import 'components/user-list.component.mjs';
import 'components/add-or-edit-container.component.mjs';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    app-component {
      display: block;
      width: 100%;
      column-gap: 20px;
    }
  </style>
  <div class="container gx-5">
    <div class="row">
      <div class="col">
        <div class="p-5">
          <app-user-list></app-user-list>
        </div>
      </div>
      <div class="col">
        <div class="p-5">
          <app-add-or-edit-container></app-add-or-edit-container>
        </div>
      </div>
    </div>
  </div>
`;

class AppComponent extends HTMLElement {
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
    this.host.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('app-component', AppComponent);
