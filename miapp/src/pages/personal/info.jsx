import React, { useEffect } from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import './info.less';
import '../../assets/iconfont.css';
import actions from '../../store/actions';
import api from '../../api';

const TipBox = withRouter(function (props) {
    let { title, link, icon, history } = props;
    return <div className="tipBox" onClick={ev => {
        if (link) {
            history.push(link);
        }
    }}>
        <i className={'iconfont ' + icon}></i>
        <span className="title">{title}</span>

    </div>
});

function Info(props) {
    let { history, isLogin, userInfo, syncLoginInfo, resetUserInfo } = props;
    console.log(props);
    console.log(userInfo);

    useEffect(() => {
        if (!userInfo) {
            syncLoginInfo();
        }
    }, []);

    return <div className="infoBox">


        <div className="header">
            <div className="infoContainer">
                <div className="headerBar">
                    {isLogin ? <img src={userInfo.pic ? userInfo.pic : require("../../assets/images/headPic.png")} alt="" /> : <img src={require("../../assets/images/headPic.png")} />}
                    <p onClick={ev => {
                        if (isLogin) return;
                        history.push('/personal/login');
                    }}>
                        {isLogin ? userInfo.name : '请登录'}
                    </p>
                </div>
            </div>
        </div>
        <div className="order infoContainer">
            <div className="orderHead">
                <NavLink className="title" to="/personal/order">我的订单</NavLink>
                <NavLink className="allOrder" to="/personal/order">全部订单<i className='iconfont icon-arrow'></i></NavLink>
            </div>
            <div className="orderItem">
                <TipBox title='待付款' icon="icon-payWait" link='/personal/order' />
                <TipBox title='待收货' icon="icon-receive" link='/personal/order' />
                <TipBox title='评价' icon="icon-evalute" link='/personal/order' />
                <TipBox title='退款/售后' icon="icon-saleReturn" link='/personal/order' />
            </div>
        </div>
        <div className="tool infoContainer">
            <div className="orderHead">
                <span className="title">更多工具</span>
            </div>
            <div className="orderItem">
                <TipBox title='足迹' icon="icon-myTrack" link='/personal/order' />
                <TipBox title='钱包' icon="icon-myPurse" link='/personal/order' />
                <TipBox title='收藏' icon="icon-myCollect" link='/personal/order' />
                <TipBox title='地址' icon="icon-address" link='/personal/order' />
                <TipBox title='账户安全' icon="icon-safe" link='/personal/order' />
                <TipBox title='拼团' icon="icon-groupbooking" link='/personal/order' />
                <TipBox title='客服' icon="icon-kefu" link='/personal/order' />
            </div>

        </div >
        {isLogin ? <button className='singoutBtn' onClick={async ev => {
            let data = await api.personal.signout();
            if (parseInt(data.code) !== 0) {
                window.alert('操作失败，请稍后再试');
                return;
            }
            resetUserInfo();
        }}>退出登录</button> : null}
    </div >
}
export default connect(state => state.personal, actions.personal)(Info);
