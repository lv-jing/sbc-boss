import { Actor, Action, IMap } from 'plume2';

export default class ResourceActor extends Actor {
  defaultState() {
    return {
      resources: [],
      resourceForm: {
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
   * @param resource
   * @returns {Map<string, V>}
   */
  @Action('resource:init')
  init(state: IMap, resource) {
    return state.set('resources', resource);
  }

  /**
   * 编辑
   * @param state
   * @param data
   */
  @Action('resource:edit')
  edit(state: IMap, data) {
    return state.update('resourceForm', (resourceForm) =>
      resourceForm.merge(data)
    );
  }
}
