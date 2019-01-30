import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class TypeaheadSearchSelectionComponent extends Component {

  @action
  handleClickSelection() {
    if (this.onClickSelected) {
      this.onClickSelected(this.selectedResult);
    }
  }
}
