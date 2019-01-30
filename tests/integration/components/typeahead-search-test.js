import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, find, findAll, focus, render, triggerKeyEvent } from '@ember/test-helpers';
import { Promise as EmberPromise } from 'rsvp';
import hbs from 'htmlbars-inline-precompile';
const PEOPLE = ['Larry', 'Moe', 'Curly'];

module('Integration | Component | typeahead-search', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('noOp', () => {});
  });

  test('it expands dropdown when input is focussed', async function(assert) {
    await render(hbs`
      <TypeaheadSearch
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @newItemPrompt="Create a new customer"
        />
    `);
    assert.equal(this.element.textContent.trim(), '', 'dropdown text is not visible');
    await focus('input');
    assert.ok(this.element.textContent.trim().includes('Create a new customer'), 'dropdown text is now visible');
  });

  test('it collapses dropdown when DOM outside component is clicked', async function(assert) {
    // await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} /><p id='paragraph1'>Some text</p>`);
    await render(hbs`
      <TypeaheadSearch
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @newItemPrompt="Create a new customer"
        />
      <p id='paragraph1'>Some text</p>
    `);
    await focus('input');
    assert.ok(this.element.textContent.trim().includes('Create a new customer'), 'dropdown text is now visible');
    await click('#paragraph1');
    assert.notOk(this.element.textContent.trim().includes('Create a new customer'), 'dropdown is collapsed');
  });

  test('input can be used to search for results with search action', async function(assert) {
    let search = (query) => {
      let regex = new RegExp(query, 'i');
      return EmberPromise.resolve(PEOPLE.filter(name => name.match(regex)));
    };
    this.set('search', search);
    await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} />`);
    await render(hbs`
      <TypeaheadSearch
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @newItemPrompt="Create a new customer"
        @search={{action this.search}}
        />
    `);
    await fillIn('input', 'lar');
    assert.ok(this.element.textContent.trim().includes('Larry'), 'A customer result is rendered');
  });

  test('it can be invoked with a block used to render search results', async function(assert) {
    let search = (query) => {
      let regex = new RegExp(query, 'i');
      return EmberPromise.resolve(PEOPLE
        .map(name => { return { name, profession: 'Stooge' }; })
        .filter(person => person.name.match(regex))
      );
    };
    this.set('search', search);
    await render(hbs`<CustomerSearch @onClickNew={{action noOp}} @onClickSelected={{action noOp}} />`);
    await render(hbs`
      <TypeaheadSearch
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @newItemPrompt="Create a new customer"
        @search={{action this.search}} as |person|>
        <li>Name: {{person.name}}, Profession: {{person.profession}}</li>
      </TypeaheadSearch>
    `);
    await fillIn('input', 'lar');
    assert.ok(this.element.textContent.trim().includes('Name: Larry, Profession: Stooge'), 'A customer result is rendered');
  });

  test('results can be navigated and selected via keyboard', async function(assert) {
    let search = () => {
      return EmberPromise.resolve(PEOPLE);
    };
    this.set('search', search);
    await render(hbs`
      <TypeaheadSearch
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @newItemPrompt="Create a new customer"
        @search={{action this.search}} />
    `);
    await fillIn('input', 'lar');
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
    assert.equal(find('#selection').textContent.trim(), ('Moe'), 'Correct result is selected');
  });

});
