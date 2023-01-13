import React from 'react';
import { Alert, Button, Icon, message, Spin, Steps, Upload } from 'antd';
import { Const, Fetch, Headline, util, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const Dragger = Upload.Dragger;
const Step = Steps.Step;

const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};

const steps = [
  {
    title: <FormattedMessage id='Setting.DownloadDepartment' />,
    content: 'First-content'
  },
  {
    title: <FormattedMessage id='Setting.UploadData' />,
    content: 'Second-content'
  },
  {
    title: <FormattedMessage id='Setting.complete' />,
    content: 'Third-content'
  }
];

/**
 * 导入
 * @returns {Promise<IAsyncResult<T>>}
 */
const importGoods = (ext) => {
  return Fetch('/department/import/' + ext, {
    method: 'GET'
  });
};

export default class GoodsImport extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      ext: '',
      fileName: '',
      err: false,
      errBtn: false,
      loading: false,
      isImport: true
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current, fileName, err, isImport, errBtn } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className='container'>
          <Headline title={<FormattedMessage id='Setting.DepartmentImport' />} />
          <Alert
            message='Operating instructions：'
            description={
              <ul>
                <li>
                  {/*1、请先下载部门导入模板，并按照批注中的要求填写数据，未按要求填写将会导致导入失败。*/}
                  1.<FormattedMessage id='Setting.PleaseDownloadDepartment' />
                </li>
                <li>
                  {/*2、请选择 .xlsx或 .xls文件，文件大小≤2M，每次只能导入一个文件，建议每次导入不超过500条数据。*/}
                  2.<FormattedMessage id='Setting.PleaseSelectDepartment' />
                </li>
              </ul>
            }
          />

          <div style={styles.uploadTit}>
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>
          {current == 0 ? (
            <div style={styles.center}>
              <Button
                type='primary'
                icon='download'
                style={{ marginTop: 10 }}
                onClick={this.toDownTempl}
              >
                <FormattedMessage id='Setting.DownloadDepartment' />
              </Button>
              <div style={{ marginTop: 40 }}>
                <Button type='primary' onClick={this._next}>
                  <FormattedMessage id='Setting.nextStep' />
                </Button>
              </div>
            </div>
          ) : null}
          {current == 1 ? (
            <Spin spinning={this.state.loading}>
              <div className='steps-content' style={styles.center}>
                <Dragger
                  name='uploadFile'
                  multiple={false}
                  showUploadList={false}
                  accept='.xls,.xlsx'
                  headers={header}
                  action={Const.HOST + '/goods/excel/upload'}
                  onChange={this.upload}
                >
                  <div style={styles.content}>
                    <p
                      className='ant-upload-hint'
                      style={{ fontSize: 14, color: 'black' }}
                    >
                      {' '}
                      <Icon type='upload' />
                      <FormattedMessage id='Setting.SelectFileUpload' />
                    </p>
                  </div>
                </Dragger>
                <div style={styles.tip}>{fileName}</div>
                {err ? (
                  <div style={styles.tip}>
                    <span style={styles.error}><FormattedMessage id='Setting.ImportFailed' />！</span>
                    <FormattedMessage id='Setting.YouCan' />
                    <a onClick={this.toExcel}>
                      <FormattedMessage id='Setting.DownloadErrorTable' />
                    </a>
                    <FormattedMessage id='Setting.CheckThe' />
                  </div>
                ) : null}

                <p style={styles.grey}>
                  {/*请选择 .xlsx或 .xls文件，文件大小≤2M，每次只能导入一个文件，建议每次导入不超过500条数据。*/}
                  <FormattedMessage id='Setting.PleaseSelectDepartment' />
                </p>

                {errBtn ? (
                  <Button
                    type='primary'
                    onClick={this._importGoods}
                    disabled={isImport}
                  >
                    <FormattedMessage id='Setting.ReImport' />
                  </Button>
                ) : (
                  <Button
                    type='primary'
                    onClick={this._importGoods}
                    disabled={isImport}
                  >
                    <FormattedMessage id='Setting.ConfirmImport' />
                  </Button>
                )}
              </div>
            </Spin>
          ) : null}
          {current == 2 ? (
            <div className='steps-content' style={styles.center}>
              <div style={styles.center}>
                <p style={styles.greyBig}><FormattedMessage id='Setting.ImportSucceeded' />！</p>
                <p style={styles.grey1}>
                  {/*您可以前往部门管理列表查看已导入的部门，或是继续导入。*/}
                  You can go to the department management list to view the imported departments, or continue importing.
                </p>
              </div>

              <Button type='primary' onClick={this._init}>
                <FormattedMessage id='Setting.ContinueImporting' />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  _init = () => {
    let err = false;
    let ext = '';
    let fileName = '';
    let loading = false;
    let isImport = true;
    let errBtn = false;
    this.setState({ err, ext, fileName, loading, isImport, errBtn });
    this.prev();
  };

  _next = () => {
    this.next();
  };

  toDownTempl() {
    // 参数加密
    const token = (window as any).token;
    if (token) {
      const base64 = new util.Base64();
      const result = JSON.stringify({ token: token });
      const encrypted = base64.urlEncode(result);
      // 新窗口下载
      const exportHref = Const.HOST + `/department/excel/template/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('Please login');
    }
  }

  _importGoods = async () => {
    const { ext } = this.state;
    if (ext == '') {
      message.error('Please upload the file');
      return;
    }
    let loading = true;
    this.setState({ loading });
    const importRes: any = await importGoods(ext);
    if (importRes.res.code == 'K-030404') {
      loading = false;
      let err = true;
      let errBtn = true;
      this.setState({ loading, err, errBtn });
    } else if (importRes.res.code == Const.SUCCESS_CODE) {
      loading = false;
      this.setState({ loading });
      this.next();
    } else {
      loading = false;
      this.setState({ loading });
      message.error(importRes.res.message);
    }
  };

  upload = (info) => {
    const status = info.file.status;
    let loading = true;
    let err = false;
    if (status == 'uploading') {
      const fileName = '';
      const ext = '';
      this.setState({ ext, fileName, loading, err });
    }
    if (status === 'done') {
      let fileName = '';
      let ext = '';
      loading = false;
      if (info.file.response.code == Const.SUCCESS_CODE) {
        fileName = info.file.name;
        ext = info.file.response.context;
        let isImport = false;
        this.setState({ isImport });
        message.success(fileName + 'Upload succeeded');
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.warn('You do not have permission to access this feature');
        } else {
          message.error(info.file.response.message);
        }
      }
      this.setState({ ext, fileName, loading, err });
      return;
    } else if (status === 'error') {
      message.error('Upload failed');
      loading = false;
      this.setState({ loading, err });
      return;
    }
  };

  toExcel = () => {
    const { ext } = this.state;
    // 参数加密
    let base64 = new util.Base64();
    const atoken = (window as any).token;
    if (atoken != '') {
      let encrypted = base64.urlEncode(JSON.stringify({ token: atoken }));

      // 新窗口下载
      const exportHref =
        Const.HOST + `/department/excel/err/${ext}/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('Please login');
    }
  };
}

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
