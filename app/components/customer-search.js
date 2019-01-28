import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { task } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { isBlank } from '@ember/utils';
import { later } from '@ember/runloop';

const DEBOUNCE_MS = Ember.testing ? 0 : 250;

export default class CustomerSearchComponent extends Component {
  @service ajax;

  customers = [];
  selectedIndex = null;
  didSearch = false;
  query = '';
  classNames = [ 'relative' ];

  didInsertElement() {
    super.didInsertElement();
    document.addEventListener('mousedown', this.handleOutsideClick, true);
    this.element.addEventListener('keydown', this.handleKeyDown, true);
  }

  willDestroyElement() {
    super.willDestroyElement();
    this.element.removeEventListener('keydown', this.handleKeyDown, true);
    document.removeEventListener('mousedown', this.handleOutsideClick, true);
  }

  @action
  handleKeyDown(e) {
    if (this.customers.length > 0) {
      if (e.keyCode === 40) {
        if (this.selectedIndex === null) {
          this.set('selectedIndex', 0);
        } else if (this.selectedIndex !== null && this.selectedIndex < (this.customers.length -1)) {
          this.incrementProperty('selectedIndex');
        }
      } else if (e.keyCode === 38) {
        if (this.selectedIndex !== null && this.selectedIndex > 0) {
          this.decrementProperty('selectedIndex');
        }
      } else if (e.keyCode === 13 && this.selectedIndex !== null) {
        let customer = this.customers[this.selectedIndex];
        this.selectCustomer(customer);
      }
    }
  }

  clearState() {
    this.setProperties({
      query: '',
      didSearch: false,
      selectedIndex: null
    });
    this.get('customers').clear();
  }

  @action
  selectCustomer(customer) {
    this.set('selectedCustomer', customer);
    this.clearState();
  }

  @action deselectCustomer() {
    this.set('selectedCustomer', null);
    later(() => {
      this.element.querySelector('input').focus();
    });
  }

  @action
  handleOutsideClick(e) {
    if (!this.element.contains(e.target)) {
      this.set('focussed', false);
    }
  }

  @action
  handleFocus() {
    this.set('focussed', true);
  }

  @task({ restartable: true })
  *searchCustomers(query) {
    if (isBlank(query)) {
      this.get('customers').clear();
      this.set('didSearch', false);
      return;
    }
    // Debounce
    yield timeout(DEBOUNCE_MS);

    let result = yield this.ajax.request('/api/customers', {
      data: {
        filter: query
      }

    })
    let customers = result.data.map(customer => customer.attributes);
    this.set('didSearch', true);
    this.set('selectedIndex', null);
    this.get('customers').setObjects(customers);
  }

  @action
  handleInput(value) {
    this.set('query', value);
    this.get('searchCustomers').perform(value);
  }

}
