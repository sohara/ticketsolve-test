import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import { setProperties } from '@ember/object';

const NEW_CUSTOMER = {
  name: '',
  email: '',
  phone: '',
  mobile: ''
};

export default class ApplicationController extends Controller {
  customer = {};
  editCustomer = null;

  @action
  cancelEdit() {
    this.set('customer', {});
    this.set('editCustomer', null);
  }

  @action
  editCustomer(customer) {
    this.set('customer', customer);
    this.set('editCustomer', Object.assign({}, customer));
  }

  @action
  createCustomer() {
    this.set('editCustomer', Object.assign({}, NEW_CUSTOMER));
  }

  @action
  submitEdit(e) {
    e.preventDefault();
    let customer = this.get('customer');
    setProperties(customer, this.get('editCustomer'))
  }

  @action
  onDeslectCustomer() {
    this.set('editCustomer', null);
  }

}
