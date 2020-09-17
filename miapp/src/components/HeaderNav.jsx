import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './HeaderNav.less';
import '../assets/iconfont.css';

function HeaderNav(props) {
    let { title, url = '' } = props;
    return <div className="HeaderNavBox">
        <i className="iconfont icon-return" onClick={ev => {
            if (url) {
                props.history.push(url);
            } else {
                props.history.go(-1);
            }
        }} ></i >
        <div className="title">
            {title}
        </div>
        {props.children}
    </div >;

}
export default withRouter(HeaderNav);