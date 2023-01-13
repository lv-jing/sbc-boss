import { Actor, Action, IMap } from 'plume2';

export default class PictureActor extends Actor {
  defaultState() {
    return {
      pictures: [],
      pictureForm: {
        //配置信息
        configKey: '',
        configName: '',
        configType: '',
        context: '',
        remark: '',
        status: 0,
        //阿里云
        endPoint: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucketName: ''
      }
    };
  }

  constructor() {
    super();
  }

  /**
   * 初始化
   * @param state
   * @param picture
   * @returns {Map<string, V>}
   */
  @Action('picture:init')
  init(state: IMap, picture) {
    return state.set('pictures', picture);
  }

  /**
   * 编辑
   * @param state
   * @param data
   */
  @Action('picture:edit')
  edit(state: IMap, data) {
    return state.update('pictureForm', (pictureForm) =>
      pictureForm.merge(data)
    );
  }
}
