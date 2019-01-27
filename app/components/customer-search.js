import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { isBlank } from '@ember/utils';

const DEBOUNCE_MS = 250;

export default class CustomerSearchComponent extends Component {
  @service ajax;

  customers = [];

  didInsertElement() {
    super.didInsertElement();
    document.addEventListener('mousedown', this.handleOutsideClick, true);
  }

  willDestroyElement() {
    super.willDestroyElement();
    document.removeEventListener('mousedown', this.handleOutsideClick, true);
  }

  @action
  handleOutsideClick(e) {
    let el = document.getElementById(this.elementId);
    if (!el.contains(e.target)) {
      this.set('dropdownExpanded', false);
    }
  }

  @action
  handleFocus() {
    this.set('dropdownExpanded', true);
  }

  @task({ restartable: true })
  *searchCustomers(query) {
    if (isBlank(query)) {
      this.set('customers', []);
      return;
    }
    // Debounce
    yield timeout(200);

    let result = yield this.ajax.request('/api/customers', {
      data: {
        filter: query
      }

    })
    let customers = result.data.map(customer => customer.attributes);
    this.set('customers', customers);
  }

  @action
  handleInput(e) {
    this.get('searchCustomers').perform(e.target.value);
  }

}
