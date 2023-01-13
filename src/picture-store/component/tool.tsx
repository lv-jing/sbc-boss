import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      showCateModal: Function; //分类弹窗
      showUploadImageModal: Function; //上传图片弹窗
      queryImagePage: Function; //搜索图片分页信息
      search: Function; //模糊搜索
      currentPage: number; //分页
      imageName: string; //搜索的图片名
    };
  };

  static relaxProps = {
    showCateModal: noop,
    queryImagePage: noop,
    showUploadImageModal: noop,
    search: noop,
    imageName: 'imageName'
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_pictureStore_3">
          <Button type="primary" onClick={this._upload}>
            <FormattedMessage id="Setting.uploadImage" />
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName="f_resourceCate_2">
          <Button type="primary" onClick={this._showModal}>
            <FormattedMessage id="Setting.addCategory" />
          </Button>
        </AuthWrapper>
        <Button type="primary" style={{ visibility: 'hidden' }}>
          占位
        </Button>
        <div style={{ float: 'right' }}>
          <Form layout="inline">
            <FormItem>
              <Input
                placeholder="Enter image name"
                value={this.props.relaxProps.imageName}
                onChange={this._editSearchData}
              />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this._search} htmlType="submit">
                 <span>
                  <FormattedMessage id="Setting.search" />
                </span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 修改搜索数据
   */
  _editSearchData = (e) => {
    const { search } = this.props.relaxProps;
    search(e.target.value);
  };

  /**
   * 查询
   */
  _search = () => {
    const { queryImagePage } = this.props.relaxProps;
    queryImagePage();
  };

  /**
   * 新增分类
   * @private
   */
  _showModal = () => {
    const { showCateModal } = this.props.relaxProps;
    showCateModal(true);
  };

  /**
   * 上传图片
   * @private
   */
  _upload = () => {
    const { showUploadImageModal } = this.props.relaxProps;
    showUploadImageModal(true);
  };
}
