import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Icon, message, Spin, Steps, Upload, Radio } from 'antd';
import { Const, Fetch, noop, util } from 'qmkit';

const { Step } = Steps;
const RadioGroup = Radio.Group;

const Dragger = Upload.Dragger;

const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};

/**
 * 导入
 * @returns {Promise<IAsyncResult<T>>}
 */
const importCustomer = (ext, sendMsgFlag) => {
  return Fetch('/customer/customerImport/import/' + ext + '/' + sendMsgFlag, {
    method: 'GET'
  });
};

@Relax
export default class ImportStep extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentStep: number;
      toNextStep: Function;
      toPrevStep: Function;
      downloadTemplate: Function;
    };
  };

  static relaxProps = {
    currentStep: 'currentStep',
    toNextStep: noop,
    toPrevStep: noop,
    downloadTemplate: noop
  };

  state = {
    ext: '',
    fileName: '',
    err: false,
    errBtn: false,
    loading: false,
    isImport: true,
    sendMsgFlag: '1',
    sendMsgSuccessCount: 0,
    sendMsgFailedCount: 0
  };

  render() {
    const { currentStep, downloadTemplate, toNextStep } = this.props.relaxProps;
    const {
      fileName,
      err,
      errBtn,
      loading,
      isImport,
      sendMsgFlag
    } = this.state;
    return (
      <div>
        <div style={styles.uploadTit}>
          <Steps current={currentStep}>
            {steps.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
          {currentStep == 0 && (
            <div style={{ marginTop: 30, textAlign: 'center' }}>
              <div>
                <Button
                  onClick={() => downloadTemplate()}
                  type="primary"
                  icon="download"
                >
                  下载导入模板
                </Button>
              </div>
              <div style={{ marginTop: 30 }}>
                <Button onClick={() => toNextStep()} type="primary">
                  下一步
                </Button>
              </div>
            </div>
          )}
          {currentStep == 1 && (
            <div style={{ marginTop: 30, textAlign: 'center' }}>
              <Spin spinning={loading}>
                <div className="steps-content" style={styles.center}>
                  <Dragger
                    name="uploadFile"
                    multiple={false}
                    showUploadList={false}
                    accept=".xls,.xlsx"
                    headers={header}
                    action={
                      Const.HOST + '/customer/customerImport/excel/upload'
                    }
                    onChange={this._upload}
                  >
                    <div style={styles.content}>
                      <p
                        className="ant-upload-hint"
                        style={{ fontSize: 14, color: 'black' }}
                      >
                        <Icon type="upload" />选择文件上传
                      </p>
                    </div>
                  </Dragger>
                  <div style={styles.tip}>{fileName}</div>
                  {err ? (
                    <div style={styles.tip}>
                      <span style={styles.error}>导入失败！</span>
                      您可以<a onClick={this._toExcel}>
                        下载错误表格
                      </a>，查看错误原因，修改后重新导入。
                    </div>
                  ) : null}

                  <p style={styles.grey}>
                    请选择.xlsx或.xls文件，文件大小≤2M，每次只能导入一个文件，建议每次导入不超过500条客户数据。
                  </p>
                  <div style={styles.grey}>
                    客户短信通知：<RadioGroup
                      onChange={this._changeSendMsg}
                      value={sendMsgFlag}
                    >
                      <Radio value="1">是</Radio>
                      <Radio value="2">否</Radio>
                    </RadioGroup>
                  </div>

                  {errBtn ? (
                    <Button
                      type="primary"
                      onClick={this._importCustomer}
                      disabled={isImport}
                    >
                      重新导入
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={this._importCustomer}
                      disabled={isImport}
                    >
                      确认导入
                    </Button>
                  )}
                </div>
              </Spin>
            </div>
          )}
          {currentStep == 2 && (
            <div style={{ marginTop: 30, textAlign: 'center' }}>
              <div className="steps-content" style={styles.center}>
                <div style={styles.center}>
                  <p style={styles.greyBig}>导入成功！</p>
                  {sendMsgFlag == '1' && (
                    <p style={styles.grey1}>
                      短信发送条数：{this.state.sendMsgSuccessCount}
                      {'  '}
                      短信发送失败条数：{this.state.sendMsgFailedCount}
                    </p>
                  )}
                  <p style={styles.grey1}>
                    您可以前往客户列表查看已导入客户，或是继续导入。
                  </p>
                </div>

                <Button type="primary" onClick={this._init}>
                  继续导入
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  _init = () => {
    this.setState({
      ext: '',
      fileName: '',
      err: false,
      errBtn: false,
      loading: false,
      isImport: true,
      sendMsgFlag: '1',
      sendMsgSuccessCount: 0,
      sendMsgFailedCount: 0
    });
    this._prevStep();
  };

  _nextStep = () => {
    const { toNextStep } = this.props.relaxProps;
    toNextStep();
  };

  _prevStep = () => {
    const { toPrevStep } = this.props.relaxProps;
    toPrevStep();
  };

  _changeSendMsg = (e) => {
    this.setState({ sendMsgFlag: e.target.value });
  };

  _importCustomer = async () => {
    const { ext, sendMsgFlag } = this.state;
    if (ext == '') {
      message.error('请上传文件');
      return;
    }
    this.setState({ loading: true });
    let flag;
    if (sendMsgFlag == '1') {
      flag = true;
    } else {
      flag = false;
    }
    const importRes: any = await importCustomer(ext, flag);
    if (importRes.res.code == 'K-030404') {
      this.setState({ loading: false, err: true, errBtn: true });
    } else if (importRes.res.code == Const.SUCCESS_CODE) {
      this.setState({ loading: false });      
      let sendMsgSuccessCount = importRes.res.context.sendMsgSuccessCount;
      let sendMsgFailedCount = importRes.res.context.sendMsgFailedCount;
      this.setState({ sendMsgSuccessCount, sendMsgFailedCount });
      this._nextStep();
    } else {
      this.setState({ loading: false });
      message.error(importRes.res.message);
    }
  };

  _upload = (info) => {
    const status = info.file.status;
    let err = false;
    if (status == 'uploading') {
      const fileName = '';
      const ext = '';
      this.setState({ ext, fileName, loading: true, err });
    }
    if (status === 'done') {
      let fileName = '';
      let ext = '';
      if (info.file.response.code == Const.SUCCESS_CODE) {
        fileName = info.file.name;
        ext = info.file.response.context;
        let isImport = false;
        this.setState({ isImport });
        message.success(fileName + '上传成功');
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.error('此功能您没有权限访问');
        } else {
          message.error(info.file.response.message);
        }
      }
      this.setState({ ext, fileName, loading: false, err });
      return;
    } else if (status === 'error') {
      message.error('上传失败');
      this.setState({ loading: false, err });
      return;
    }
  };

  /**
   * 下载错误excel
   * @private
   */
  _toExcel = () => {
    const { ext } = this.state;
    // 参数加密
    let base64 = new util.Base64();
    const atoken = (window as any).token;
    if (atoken != '') {
      let encrypted = base64.urlEncode(JSON.stringify({ token: atoken }));

      // 新窗口下载
      const exportHref =
        Const.HOST + `/customer/customerImport/excel/err/${ext}/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };
}

const steps = [
  {
    title: '下载客户导入模板'
  },
  {
    title: '上传数据'
  },
  {
    title: '完成'
  }
];

const styles = {
  uploadTit: {
    margin: '40px 200px'
  },
  content: {
    background: '#fcfcfc',
    padding: '50px 0'
  },
  grey: {
    color: '#999999',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  tip: {
    marginTop: 10,
    marginLeft: 10,
    color: '#333'
  },
  error: {
    color: '#e10000'
  },
  grey1: {
    color: '#666666',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10
  },
  center: {
    textAlign: 'center'
  },
  greyBig: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold'
  } as any
};
