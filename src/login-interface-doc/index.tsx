import React from 'react';

export default class InterfaceDoc extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <img src={require('./imgs/help.png')} alt="" />
      </div>
    );
  }
}

const styles = {
  container: {
    overflow: 'auto',
    padding: 20,
    height: 'calc(100vh)'
  }
} as any;
