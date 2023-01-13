import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      setEdit: Function;
      setVisible: Function;
    };
  };

  static relaxProps = {
    setEdit: noop,
    setVisible: noop
  };

  render() {

    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_create_tag'}>
          <Button
            type="primary"
            onClick={() =>
              this._add()
            }
          >
            新建标签
          </Button>
        </AuthWrapper>
      </div >
    );
  }

  _add = () => {
    const { setEdit, setVisible } = this.props.relaxProps;
    setEdit(false);
    setVisible(true);
  }
}
