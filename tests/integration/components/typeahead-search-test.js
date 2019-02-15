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
    this.set('results', []);
    let search = (query) => {
      let regex = new RegExp(query, 'i');
      return new EmberPromise(resolve => {
        this.results.setObjects(PEOPLE.filter(name => name.match(regex)));
        resolve();
      });
    };
    this.set('search', search);
  });

  test('it expands dropdown when input is focussed', async function(assert) {
    await render(hbs`
      <TypeaheadSearch
        @search={{action search}}
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
    await render(hbs`
      <TypeaheadSearch
        @search={{action search}}
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
    await render(hbs`
      <TypeaheadSearch
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @newItemPrompt="Create a new customer"
        @search={{action search}}
        @results={{this.results}}
        @onSelectResult={{action noOp}}
        />
    `);
    await fillIn('input', 'lar');
    assert.ok(this.element.textContent.trim().includes('Larry'), 'A customer result is rendered');
  });

  test('it can be used with block invocation of contextual components to render search results', async function(assert) {
    let search = (query) => {
      let regex = new RegExp(query, 'i');
      return new EmberPromise(resolve => {
        this.results.setObjects(PEOPLE.filter(name => name.match(regex))
          .map(name => { return { name, profession: 'Stooge' }; }));
        resolve();
      });
    };
    this.set('search', search);
    await render(hbs`
      <TypeaheadSearch
        @results={{this.results}}
        @search={{action this.search}} as |t|>
        <t.input />
        <t.results
          @onClickNew={{action noOp}}
          @newItemPrompt="Add a new person"
          as |person|>
          <li>Name: {{person.name}}, Profession: {{person.profession}}</li>
        </t.results>
      </TypeaheadSearch>
    `);
    await fillIn('input', 'lar');
    assert.ok(this.element.textContent.trim().includes('Name: Larry, Profession: Stooge'), 'A customer result is rendered');
  });

  test('results can be navigated and selected via keyboard', async function(assert) {
    let search = () => {
      return new EmberPromise(resolve => {
        this.results.setObjects(PEOPLE);
        resolve();
      });
    };
    this.set('search', search);
    this.set('selectedResult', null)
    await render(hbs`
      <TypeaheadSearch
        @results={{this.results}}
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @newItemPrompt="Create a new customer"
        @onSelectResult={{action (mut this.selectedResult)}}
        @selectedResult={{this.selectedResult}}
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
    assert.equal(find('.typeahead-search-selection').textContent.trim(), ('Moe'), 'Correct result is selected');
  });

  test('selected result can be cleared, leaving typeahed in empty state', async function(assert) {
    let search = () => {
      return new EmberPromise(resolve => {
        this.results.setObjects(PEOPLE);
        resolve();
      });
    };
    this.set('search', search);
    this.set('selectedResult', null)
    await render(hbs`
      <TypeaheadSearch
        @results={{this.results}}
        @onClickNew={{action noOp}}
        @onClickSelected={{action noOp}}
        @onSelectResult={{action (mut this.selectedResult)}}
        @selectedResult={{this.selectedResult}}
        @newItemPrompt="Create a new customer"
        @search={{action this.search}} />
    `);
    await fillIn('input', 'lar');

    // ArrowDown to select first result
    await triggerKeyEvent('input', 'keydown', 40);
    assert.ok(find('li').classList.contains('selected'), 'First result is navigated');

    // Enter to select item
    await triggerKeyEvent('input', 'keydown', 13);
    assert.notOk(find('ul'), 'Results list is no longer rendered');
    assert.equal(find('.typeahead-search-selection').textContent.trim(), ('Larry'), 'Correct result is selected');

    await click('.typeahead-search-selection button.close');
    assert.equal(find('input').value, '', 'previous input entry cleared');
  });

});
