import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

export default class CustomerSearchComponent extends Component {
  @service ajax;

  @action
  search(query) {
    return this.ajax.request('/api/customers', {
      data: {
        filter: query
      }
    }).then(result => {
      return result.data.map(result => result.attributes);
    })
  }
}
