import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

const NEW_CUSTOMER = {
  name: '',
  email: '',
  phone: '',
  mobile: ''
};

export default class ApplicationController extends Controller {
  customer = null;

  @action
  cancelEdit() {
    this.set('customer', null);
  }

  @action
  editCustomer(customer) {
    this.set('customer', customer);
  }

  @action
  createCustomer() {
    this.set('customer', Object.assign({}, NEW_CUSTOMER));
  }

}
