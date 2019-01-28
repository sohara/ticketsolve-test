import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, find, findAll, focus, render, triggerKeyEvent } from '@ember/test-helpers';
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

  test('it expands dropdown when input is focussed', async function(assert) {
    await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} />`);
    assert.equal(this.element.textContent.trim(), '', 'dropdown text is not visible');
    await focus('input');
    assert.ok(this.element.textContent.trim().includes('Create a new customer'), 'dropdown text is now visible');
  });

  test('it collapses dropdown when DOM outside component is clicked', async function(assert) {
    await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} /><p id='paragraph1'>Some text</p>`);
    await focus('input');
    assert.ok(this.element.textContent.trim().includes('Create a new customer'), 'dropdown text is now visible');
    await click('#paragraph1');
    assert.notOk(this.element.textContent.trim().includes('Create a new customer'), 'dropdown is collapsed');
  });

  test('input can be used to search customers', async function(assert) {
    await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} />`);
    await fillIn('input', 'sean');
    assert.ok(this.element.textContent.trim().includes('Sean Hanly'), 'A customer result is rendered');
  });

  test('a block can be passed to render customers', async function(assert) {
    await render(hbs`
    <CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} as |customer|>
      Hello {{customer.name}}
    </CustomerSearch>
    `);
    await fillIn('input', 'sean');
    assert.ok(this.element.textContent.trim().includes('Hello Sean Hanly'), 'A customer result is rendered');
  });

  test('results can be navigated and selected via keyboard', async function(assert) {
    await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} />`);
    await fillIn('input', 'a');
    assert.notOk(find('li').classList.contains('selected'), 'First result is not navigated');

    // ArrowDown to select first result
    await triggerKeyEvent('input', 'keydown', 40);
    assert.ok(find('li').classList.contains('selected'), 'First result is navigated');

    // ArrowDown twice and ArrowUp once to select second result
    await triggerKeyEvent('input', 'keydown', 40);
    await triggerKeyEvent('input', 'keydown', 40);
    await triggerKeyEvent('input', 'keydown', 38);
    assert.notOk(find('li').classList.contains('selected'), 'First result is not navigated');
    assert.ok(findAll('li')[1].classList.contains('selected'), 'Second result is navigated');

    // Enter to select item
    await triggerKeyEvent('input', 'keydown', 13);
    assert.notOk(find('ul'), 'Results list is no longer rendered');
    assert.equal(find('#selection').textContent.trim(), ('Zoe Brillante'), 'Correct result is selected');
  });
});
