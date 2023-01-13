import { IOptions, Store } from 'plume2';
import { QMMethod, VASConst } from 'qmkit';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [];
  }

  checkIEP = async () => {
    const res = await QMMethod.fetchVASStatus(VASConst.IEP);
    return res;
  };
}
