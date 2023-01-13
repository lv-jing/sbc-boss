import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IRoute } from './route-with-subroutes';
import noop from './noop';
import { homeRoutes } from '../../src/router';
import { fromJS } from 'immutable';
import { util } from 'qmkit';

export type Loader = () => Promise<any>;

export interface Props {
  path: string;
  exact?: boolean;
  strict?: boolean;
  load: Loader;
  subRoutes?: Array<IRoute>;
  handlePathMatched?: Function;
}

/**
 * 封装异步路由的解决方案
 * @param props 路由参数
 */
export default function AsyncRoute(props: Props) {
  const { load, handlePathMatched, subRoutes, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(props) => {
        const unAuthRoutes = fromJS(homeRoutes);
        if (
          unAuthRoutes.some((route) => route.get('path') == props.match.path)
        ) {
          // 1.不需要登录权限,直接可以访问的页面
          return <AsyncLoader {...props} load={load} subRoutes={subRoutes} />;
        } else {
          if (util.isLogin()) {
            // 2.1.需要登录权限,已经登录,则跳转路由对应的页面
            return (
              <AsyncLoader
                {...props}
                load={load}
                subRoutes={subRoutes}
                handlePathMatched={handlePathMatched}
              />
            );
          } else {
            // 2.2.未登录,跳转登录页面
            return (
              <Redirect
                to={{ pathname: '/login', state: { from: props.location } }}
              />
            );
          }
        }
      }}
    />
  );
}

/**
 * 异步load模块组件
 */
class AsyncLoader extends React.Component<any, any> {
  props: {
    subRoutes?: Array<IRoute>;
    load: Loader;
    handlePathMatched?: Function;
    match: any;
  };

  state: {
    Component: React.ComponentClass<any>;
  };

  static defaultProps = {
    load: noop,
    handlePathMatched: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  componentDidMount() {
    const { load } = this.props;

    const { handlePathMatched } = this.props;
    handlePathMatched(this.props.match.path);

    load().then((Component) =>
      this.setState({
        Component: Component.default || Component
      })
    );
  }

  render() {
    const { Component } = this.state;

    return Component ? (
      <Component {...this.props} key={Math.random()} />
    ) : (
      <div>loading...</div>
    );
  }
}
