export default function() {
  this.namespace = 'api';

  let server = this;
  this.get('/customers', (schema, request) => {
    let regex = new RegExp(request.queryParams.filter, 'i');
    return schema.customers.all().filter(customer => customer.attrs.name.match(regex));
  });

  this.post('/customers', function () {
    let customer = server.create('customer');
    let attrs = this.normalizedRequestAttrs();
    customer.update(attrs);
    return customer;
  });

  this.put('/customers/:id');

}
