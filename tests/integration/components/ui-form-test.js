import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui-form', function(hooks) {
  setupRenderingTest(hooks);

  test('allows data editing', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    let model = { name: 'Jack', email: 'jack@whatever.com'};
    this.set('model', model);
    this.set('submitEdit', (e) => {
      e.preventDefault();
    });


    // Template block usage:
    await render(hbs`
      <UiForm @model={{model}} @onsubmit={{action submitEdit}} as |f|>
        <f.input @field="name" @label="Name" />
        <f.input @field="email" @label="Email" />
        <f.submitButton />
      </UiForm>
    `);

    await fillIn('input#Name', 'John');
    await fillIn('input#Email', 'john@google.com');
    await click('button[type="submit"]');
    assert.equal(this.model.name, 'John', 'Name attribute is correctly updated');
  });
});
