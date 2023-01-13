import React from 'react';
import { Modal, Carousel } from 'antd';
import { fromJS } from 'immutable';

export default class ImageModal extends React.Component<any, any> {
  props: {
    // 图片集合, ['http://xxxxxx','http://xxxxxx']
    imgList: any;
    // 每个图片展示的样式
    imgStyle: any;
  };

  constructor(props) {
    super(props);
    this.state = {
      // 弹框中图片展示的集合
      sImgList: props.imgList,
      // 弹框是否展示
      previewVisible: false
    };
  }

  render() {
    const { imgList, imgStyle } = this.props;
    const { sImgList, previewVisible } = this.state;
    return [
      imgList &&
        imgList.length > 0 &&
        imgList.map((v, k) => {
          return (
            <a href="javascript:;" key={k} onClick={() => this.showImg(v)}>
              <img style={imgStyle} src={v} />
            </a>
          );
        }),
      previewVisible &&
        sImgList &&
        sImgList.length > 0 && (
           <Modal  maskClosable={false}
            key="imgModal"
            className="open-pic"
            visible={previewVisible}
            footer={null}
            width={'100vw'}
            onCancel={() => this.onCancel()}
          >
            <Carousel dots={false} arrows={imgList.length > 1}>
              {sImgList.map((file, i) => (
                <div key={i}>
                  <img alt="example" src={file} />
                </div>
              ))}
            </Carousel>
          </Modal>
        )
    ];
  }

  /**
   * 弹框展示图片
   */
  showImg = (img) => {
    let imgList = fromJS(this.props.imgList).toJS();
    let index = imgList.indexOf(img);
    imgList = imgList.splice(index, imgList.length - index + 1).concat(imgList);
    this.setState({
      sImgList: imgList,
      previewVisible: true
    });
  };

  /**
   * 关闭弹框
   */
  onCancel = () => {
    this.setState({
      previewVisible: false
    });
  };
}
