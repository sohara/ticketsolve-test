export default function() {
  this.namespace = 'api';
  // this.timing = 1000;

  this.get('/customers', (schema, request) => {
    let regex = new RegExp(request.queryParams.filter, 'i');
    return schema.customers.all().filter(customer => customer.attrs.name.match(regex));
  });

}
