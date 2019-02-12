import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class TypeaheadSearchResultsComponent extends Component {
  classNames = ['fixed'];
  listWidth = null;

  @action
  handleResize() {
    let timeout;
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }
    timeout = window.requestAnimationFrame(function() {
      this.setListWidth();
    }.bind(this));
  }

  didInsertElement() {
    super.didInsertElement();
    this.setListWidth();
    window.addEventListener('resize', this.handleResize);
  }

  willDestroyElement() {
    super.willDestroyElement();
    window.removeEventListener('resize', this.handleResize);
  }

  setListWidth() {
    let parentWidth = this.element.parentElement.offsetWidth;
    this.set('listWidth', parentWidth);
  }
}
