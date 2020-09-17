import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import HeaderNav from '../../components/HeaderNav';
import './order.less';
import actions from '../../store/actions';
import api from '../../api';
import { useState } from 'react';

function orderFn(orderList, syncOrderList) {
    if (!orderList) {
        syncOrderList();
        console.log(orderList);
    }
}
function btnWord(state) {
    if (state === 1) {
        return <><button className="btnStyle" >取消订单</button><button className="btnStyle" >付款</button></>;
    } else if (state === 2) {
        return <><button className="btnStyle" >退款</button><button className="btnStyle" >确认收货</button></>;
    } else if (state === 3) {
        return <><button className="btnStyle" >退款</button><button className="btnStyle" >评价</button></>;
    } else if (state === 4) {
        return <><button className="btnStyle" >取消退款</button></>;
    } else {
        return <><button className="btnStyle" >退款</button></>;
    }
}

function Order(props) {
    let { history, location, isLogin, userInfo, syncLoginInfo, orderList, syncOrderList } = props;

    let [active, changeActive] = useState(() => {
        let search = location.search || '';
        let searchObj = {};
        search.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, key, value) => {
            searchObj[key] = value;
        });
        return parseInt(searchObj.lx) || 0;
    })

    let dataList = null;
    if (orderList && orderList.length > 0) {
        if (active === 0) {
            dataList = orderList
        } else {
            dataList = orderList.filter(item => {
                return parseInt(item.state) === active;
            })
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (userInfo) {
                orderFn(orderList, syncOrderList);
                return;
            };
            let data = await api.personal.loginGET();

            if (parseInt(data.code) === 0) {
                console.log(orderList);
                orderFn(orderList, syncOrderList);
                syncLoginInfo();
                return;
            }
            window.alert('当前未登录，请您先登录');
            history.push('/personal/login');
        }
        fetchData();
    }, []);





    return <>
        {isLogin ? <div className="personalOrder">
            <HeaderNav title='我的订单' url='/personal' />
            <div className="navBox">
                {
                    ["全部订单", "待付款", "待收货", "待评价", "退款订单"].map((item, index) => {
                        return <Link key={index}
                            className={index === active ? "navItem active" : "navItem"}
                            to={'/personal/order?lx=' + index}
                            onClick={ev => {
                                changeActive(index);
                            }}> {item}</Link>
                    })
                }

            </div>
            {dataList && dataList.length > 0 ? <ul className="orderList">
                {

                    dataList.map(item => {
                        return <li className="orderItem">
                            <div className="orderTop">{item.store}</div>
                            <Link to={"/detail/" + item.id}>
                                <div className="orderMid">
                                    <img src={item.pic} alt="" />
                                    <div className="orderInfo">
                                        <span className="orderName">{item.name}</span>
                                        <div className="priceNum">
                                            <span className="price">￥{item.price}</span>
                                            <span className="count">x {item.count}</span>
                                        </div>

                                    </div>
                                </div>
                            </Link>
                            <div className="btnGroup">
                                {btnWord(item.state)}
                            </div>
                        </li>
                    })
                }
            </ul> : <div className="noTip">
                    <i></i>
                    <span>目前没有任何订单</span>
                </div>}

        </div> : null
        }
    </>
}
export default connect(state => {
    return {
        ...state.personal,
        ...state.cart
    }
}, {
    ...actions.personal,
    ...actions.cart
})(Order);