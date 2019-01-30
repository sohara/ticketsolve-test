import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, find, render, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { startMirage } from 'ticketsolve/initializers/ember-cli-mirage';
import defaultScenario from '../../../mirage/scenarios/default';

module('Integration | Component | customer-search', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    this.server = startMirage();
    defaultScenario(this.server);
    this.set('noOp', () => {});
  });
  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it can be used to search and select customers', async function(assert) {
    await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} />`);
    await fillIn('input', 'sean');
    assert.ok(this.element.textContent.trim().includes('Sean Hanly'), 'A customer result is rendered');

    // ArrowDown thrice to select third result
    await triggerKeyEvent('input', 'keydown', 40);
    await triggerKeyEvent('input', 'keydown', 40);
    await triggerKeyEvent('input', 'keydown', 40);

    await triggerKeyEvent('input', 'keydown', 13);
    assert.notOk(find('ul'), 'Results list is no longer rendered');
    assert.equal(find('#selection').textContent.trim(), ('Sean Hanly'), 'Correct result is selected');
  });

});
