import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Personal from './pages/personal/personal';
import Detail from './pages/home/detail';
import FooterNav from './components/FooterNav';
import Cart from "./pages/cart/cart";
import Category from "./pages/category/category";
import Home from "./pages/home/Home";
// import Swiper from 'swiper';


import './assets/basic.less';
import './assets/reset.min.css';
import 'swiper/package/css/swiper.css';

class App extends React.Component {
    render() {
        return <>
            <Switch>
                <Route path='/' component={Home} exact />
                <Route path='/personal' component={Personal} />
                <Route path='/Category' component={Category} />
                <Route path='/cart' component={Cart} />
                <Route path='/detail/:id' component={Detail} />
                <Redirect to='/' />
            </Switch>
            <FooterNav></FooterNav>
        </>
    }
}
export default App;