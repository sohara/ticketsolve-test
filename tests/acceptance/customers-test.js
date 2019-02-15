import { module, test } from 'qunit';
import { visit, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { startMirage } from 'ticketsolve/initializers/ember-cli-mirage';

module('Acceptance | customers', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  })

  test('creating a new customer', async function(assert) {
    await visit('/');
    await click('input.customer-search-input');
    assert.dom('ul').isVisible();

    await click('ul li.new-item')
    await fillIn('input#Name', 'Sergi Ferran');
    await fillIn('input#Email', 'sergi@ticketsolve.com');
    await fillIn('input#Phone', '+34 342 923432');
    await fillIn('input#Mobile', '+34 986 234234');

    await click('button[type="submit"]');
    assert.dom('span').hasText('Sergi Ferran');

    await click('.typeahead-search-selection button.close');
    await fillIn('input.customer-search-input', 'ser');
    assert.dom('ul').includesText('Sergi Ferran');
  });
});
