import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { action } from '@ember-decorators/object';
import { isBlank } from '@ember/utils';
import { timeout } from 'ember-concurrency';
import { later } from '@ember/runloop';
import Ember from 'ember';
const DEBOUNCE_MS = Ember.testing ? 0 : 250;

export default class TypeaheadSearchComponent extends Component.extend({

  handleSearch: task(function * (query) {
    this.set('query', query);
    if (isBlank(query)) {
      this.set('didSearch', false);
      return;
    }

    // Debounce
    yield timeout(DEBOUNCE_MS);

    yield this.search(query);
    this.set('didSearch', true);
    this.set('selectedIndex', null);
  }).restartable()
}) {
  focussed = false;
  results = [];
  selectedIndex = null;
  selectedResult = null;
  didSearch = false;
  query = '';
  classNames = [ 'relative' ];

  didInsertElement() {
    super.didInsertElement();
    document.addEventListener('mousedown', this.handleOutsideClick, true);
    this.element.addEventListener('keydown', this.handleKeyDown, true);
  }

  willDestroyElement() {
    super.willDestroyElement();
    this.element.removeEventListener('keydown', this.handleKeyDown, true);
    document.removeEventListener('mousedown', this.handleOutsideClick, true);
  }

  clearState() {
    this.setProperties({
      query: '',
      didSearch: false,
      selectedIndex: null
    });
    this.get('results').clear();
  }

  @action
  handleKeyDown(e) {
    if (this.results.length > 0) {
      if (e.keyCode === 40) {
        if (this.selectedIndex === null) {
          this.set('selectedIndex', 0);
        } else if (this.selectedIndex !== null && this.selectedIndex < (this.results.length -1)) {
          this.incrementProperty('selectedIndex');
        }
      } else if (e.keyCode === 38) {
        if (this.selectedIndex !== null && this.selectedIndex > 0) {
          this.decrementProperty('selectedIndex');
        }
      } else if (e.keyCode === 13 && this.selectedIndex !== null) {
        let result = this.results[this.selectedIndex];
        this.selectResult(result);
      }
    }
  }

  @action
  addNewItem() {
    if (this.onClickNew) {
      this.onClickNew();
      this.clearState();
      this.set('focussed', false);
    }
  }

  @action
  selectResult(result) {
    if (this.onSelectResult) {
      this.onSelectResult(result);
    }
    this.clearState();
  }

  @action deselectResult(e) {
    e.preventDefault();
    if (this.onDeselectOption) {
      this.onDeselectOption();
    }
    this.set('selectedResult', null);
    this.clearState();
    later(() => {
      this.element.querySelector('input').focus();
    });
  }

  @action
  handleOutsideClick(e) {
    if (!this.element.contains(e.target)) {
      this.set('focussed', false);
    }
  }

  @action
  handleFocus() {
    this.set('focussed', true);
  }
}
