import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Info from './info';
import Login from './login';
import Order from './order';
import Register from './register';

export default function Personal(props) {
    return <Switch>
        <Route path='/personal' exact component={Info} />
        <Route path='/personal/login' component={Login} />
        <Route path='/personal/register' component={Register} />
        <Route path='/personal/order' component={Order} />
    </Switch>
}