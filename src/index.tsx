import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { routeWithSubRoutes, history, noop } from 'qmkit';
import { homeRoutes } from './router';
import { LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './redux/store';
import { IntlProvider } from 'react-intl';
import { language, antLanguage } from '../web_modules/qmkit/lang';
import '@babel/polyfill';
//将common.less,外加的less等都放在一起
import './index.less';

import Main from './main';

const B2BBoss = () => (
  <IntlProvider locale="es" messages={language}>
    <LocaleProvider locale={antLanguage}>
      <Provider store={store}>
        <Router history={history}>
          <div>
            <Switch>
              {routeWithSubRoutes(homeRoutes, noop)}
              <Route component={Main} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </LocaleProvider>
  </IntlProvider>
);

ReactDOM.render(<B2BBoss />, document.getElementById('root'));
