import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import { setProperties } from '@ember/object';
import { inject as service } from '@ember-decorators/service';

const NEW_CUSTOMER = {
  name: '',
  email: '',
  phone: '',
  mobile: ''
};

export default class ApplicationController extends Controller {
  @service ajax;
  customer = {};
  editCustomer = null;
  customers = [];
  selectedResult = null;

  @action
  search(query) {
    return this.ajax.request('/api/customers', {
      data: {
        filter: query
      }
    }).then(result => {
      return this.customers.setObjects(result.data.map(data => Object.assign({}, data.attributes, { id: data.id })));
    })
  }

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
    let customer = this.get('editCustomer');
    let url;
    let method;
    if (customer.id) {
      url = `/api/customers/${customer.id}`;
      method = 'PUT';

      // PUT
    } else {
      url = `/api/customers`;
      method = 'POST';
      // POST
    }
    this.ajax.request(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      },
      data: {
        data: {
          attributes: customer,
          type: 'customers'
        }
      }
    }).then(result => {
      let resultProps = Object.assign({}, result.attributes, { id: result.id });
      setProperties(customer, resultProps)
      this.set('editCustomer', null);
      this.set('selectedCustomer', customer);
    });
  }

  @action
  onDeslectCustomer() {
    this.set('editCustomer', null);
  }

}
