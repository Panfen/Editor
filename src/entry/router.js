import React from 'react';
import { hashHistory, Router, Route, IndexRoute } from 'react-router';
import Main from '../layout/main';
import Index from '../pages/index';
import Test from '../pages/test';
import Test2 from '../pages/test2';

function RouterConfig() {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Index} />
        <Route path="index" component={Index} />
        <Route path="test" component={Test2} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
