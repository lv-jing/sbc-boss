import { Actor, Action } from 'plume2';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      images: []
    };
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
    return state.set(
      'images',
      images.map((i, index) => {
        i = i.set('imageId', index);
        return i;
      })
    );
  }

  /**
   * 移除图片
   * @param state
   * @param {number} imageId
   */
  @Action('imageActor: remove')
  removeImg(state, imageId: number) {
    return state.set(
      'images',
      state.get('images').filter((i) => i.get('imageId') !== imageId)
    );
  }
}
