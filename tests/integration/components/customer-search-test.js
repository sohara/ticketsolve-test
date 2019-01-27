import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, focus, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { startMirage } from 'ticketsolve/initializers/ember-cli-mirage';
import defaultScenario from '../../../mirage/scenarios/default';

module('Integration | Component | customer-search', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    this.server = startMirage();
    defaultScenario(this.server);
  });
  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it expands dropdown when input is focussed', async function(assert) {
    await render(hbs`<CustomerSearch />`);

    assert.equal(this.element.textContent.trim(), '', 'dropdown text is not visible');
    await focus('input');
    assert.ok(this.element.textContent.trim().includes('Create a new customer'), 'dropdown text is now visible');
  });

  test('it collapses dropdown when DOM outside component is clicked', async function(assert) {
    await render(hbs`<CustomerSearch /><p id='paragraph1'>Some text</p>`);
    await focus('input');
    assert.ok(this.element.textContent.trim().includes('Create a new customer'), 'dropdown text is now visible');
    await click('#paragraph1');
    assert.notOk(this.element.textContent.trim().includes('Create a new customer'), 'dropdown is collapsed');
  });

  test('input can be used to search customers', async function(assert) {
    await render(hbs`<CustomerSearch />`);
    await fillIn('input', 'sean');
    assert.ok(this.element.textContent.trim().includes('Sean Hanly'), 'A customer result is rendered');

  });
});
