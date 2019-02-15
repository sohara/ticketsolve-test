import { Factory, faker } from 'ember-cli-mirage';
const NAMES = [
  'Jack Seamus',
  'Zoe Brillante',
  'Joe Rasmus',
  'Rob Urie',
  'Sean O\'Hara',
  'Sean Hanly',
  'Michael Klein',
  'Paul Fadden',
  'David Dunstan',
  'Saverio Miroddi',
  'Björn Nordstrand',
  'Ling Fu'
]

export default Factory.extend({
  id(i) {
    return i;
  },

  name(i) {
    return NAMES[i];
  },

  email() {
    return faker.internet.email();
  },

  phone() {
    return faker.phone.phoneNumber();
  },

  mobile() {
    return faker.phone.phoneNumber();
  },

  uuid() {
    return faker.random.uuid();
  },

  avatar() {
    return faker.internet.avatar();
  }
});
