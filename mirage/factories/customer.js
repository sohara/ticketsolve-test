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
  name(i) {
    return NAMES[i];
  },

  age: 28,

  admin: false,

  avatar() {
    return faker.internet.avatar();
  }
});
