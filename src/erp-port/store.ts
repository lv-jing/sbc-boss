import { Store, IOptions } from 'plume2';
import VisibleActor from './actor/visible-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new VisibleActor()];
  }

  onEdit = () => {
    this.dispatch('modal:show');
  };

  onCancel = () => {
    this.dispatch('modal:hide');
  };
}
