import React from 'react';
import { hashHistory, Router, Route, IndexRoute } from 'react-router';
import Main from '../layout/main';
import Index from '../pages/Index/index';
import OldPlanEditor from '../pages/OldPlanEditor';
import PcEditor from '../pages/PcEditor';
import PlanEditor from '../pages/PlanEditor';

function RouterConfig() {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Index} />
        <Route path="index" component={Index} />
        <Route path="plan-editor0" component={OldPlanEditor} />
        <Route path="pc-editor" component={PcEditor} />
        <Route path="plan-editor" component={PlanEditor} />
      </Route>
    </Router>
  );
}

export default RouterConfig;
