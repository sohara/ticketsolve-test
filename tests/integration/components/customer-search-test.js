import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, find, render, triggerKeyEvent } from '@ember/test-helpers';
import { Promise as EmberPromise } from 'rsvp';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | customer-search', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    let search = () => {

      return new EmberPromise(resolve => {
        this.customers.setObjects([
           { name: 'Jack Seamus' },
           { name: 'Zoe Brillante' },
           { name: 'Sean Hanly' }
          ]);
        resolve(true);
      });
    };
    this.set('customers', []);
    this.set('selectedCustomer', null);
    this.set('search', search);
    this.set('noOp', () => {});
  });

  test('it can be used to search and select customers', async function(assert) {
    await render(hbs`
      <CustomerSearch
        @search={{action search}}
        @customers={{this.customers}}
        @selectedCustomer={{this.selectedCustomer}}
        @onSelectResult={{action (mut this.selectedCustomer)}}
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        />`);
    await fillIn('input', 'sean');
    assert.ok(this.element.textContent.trim().includes('Sean Hanly'), 'A customer result is rendered');

    // ArrowDown thrice to select third result
    await triggerKeyEvent('input', 'keydown', 40);
    await triggerKeyEvent('input', 'keydown', 40);
    await triggerKeyEvent('input', 'keydown', 40);

    await triggerKeyEvent('input', 'keydown', 13);
    assert.notOk(find('ul'), 'Results list is no longer rendered');
    assert.equal(find('.typeahead-search-selection').textContent.trim(), ('Sean Hanly'), 'Correct result is selected');
  });

});
