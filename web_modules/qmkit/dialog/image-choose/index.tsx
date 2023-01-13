import * as React from "react";
import { Map } from "immutable";
import { msg } from "plume2";
import { Modal } from "antd";
export default class ImageChoose extends React.Component<any, any> {
  state: {
    visible: boolean;
    option: any;
    imageChoose?: any;
    dataInfo?: any; //选中的对接值
    otherInfo?: any;
    changeVal?: any;
  };
  props: {
    onChooseImage?(...args): Promise<any>;
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imageChoose: "",
      dataInfo: Map(),
      option: {},
      changeVal: () => {},
    };
  }
  chooseValue: any = "";
  componentDidMount() {
    msg.on("edit:chooseImage", this.chooseImage);
  }
  componentWillUnmount() {
    msg.off("edit:chooseImage", this.chooseImage);
  }
  render() {
    let { visible, option, dataInfo, otherInfo, imageChoose } = this.state;
    let ImageChoose = imageChoose;
    return (
      <Modal
        className="xsite-media-dialog"
        title="编辑"
        style={{ top: 30 }}
        width={800}
        visible={visible}
        okText="确认"
        cancelText="取消"
        onOk={this.confirm}
        onCancel={this.closeModal}
      >
        <ImageChoose
          {...this.props}
          linkKey={dataInfo.get("linkKey")}
          linkInfo={dataInfo.get("info")}
          option={option}
          otherInfo={otherInfo}
          saveChooseValue={this._saveChooseValue}
        />
      </Modal>
    );
  }
  private chooseImage = async params => {
    const dialog = await import(/* webpackChunkName: "dialog-image" */ "./image-choose-dialog");
    const { onChooseImage } = this.props;
    await dialog.default({ ...params, onChooseImage });
  };
  /**
   * 图片或者链接选中后返回回来的值
   * @param chooseValue
   * @private
   */
  private _saveChooseValue = chooseValue => {
    this.chooseValue = chooseValue;
  };
  confirm = () => {
    this.setState({
      visible: false,
    });
  };
  closeModal = () => {
    this.setState({
      visible: false,
    });
  };
}
