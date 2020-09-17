import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './FooterNav.less';
import '../assets/iconfont.css';


function FooterNav(props) {
    let pathName = props.location.pathname,
        flag = /(DETAIL|REGISTER|ORDER|LOGIN)/i.test(pathName);
    return <>
        {flag ? null : <div className="FooterNavBox">
            <NavLink to="/" activeClassName="active" exact>
                <span className='iconfont icon-home '></span>
                <span>首页</span>
            </NavLink>
            <NavLink to="/category" activeClassName="active">
                <span className='iconfont icon-category'></span>
                <span>分类</span>
            </NavLink>
            <NavLink to="/cart" activeClassName="active">
                <span className='iconfont icon-cart'></span>
                <span>购物车</span>
            </NavLink>
            <NavLink to="/personal" activeClassName="active">
                <span className='iconfont icon-personal'></span>
                <span>个人中心</span>
            </NavLink>
        </div>}
    </>;
}
export default withRouter(FooterNav);