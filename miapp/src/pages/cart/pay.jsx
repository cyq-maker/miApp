import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import actions from '../../store/actions/index';
import './pay.less';
import api from '../../api';

async function handle(ev, arr, changeArr, orderList, props) {
    const target = ev.target,
        text = target.innerHTML;
    if (target.tagName !== 'SPAN') return;
    if (!isNaN(text)) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === null) {
                arr[i] = parseInt(text);
                break;
            }
        }
        changeArr([...arr]);
        return;
    }
    if (text === '删除') {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] !== null) {
                arr[i] = null;
                break;
            }
        }
        changeArr([...arr]);
        return;
    }
    if (text === '确定') {
        ev.preventDefault();
        console.log(arr.join(''));
        let data = await api.cart.payPass(arr.join(''));
        if (parseInt(data.code) === 1) {
            window.alert("密码不正确");
            return;
        }

        orderList = orderList.map(item => {
            return api.cart.state(item.id, 2);
        })
        Promise.all(orderList).then(results => {
            const flag = results.find(item => {
                return parseInt(item.code !== 0);
            })
            if (!flag) {
                window.alert('支付成功', {
                    handled: () => {
                        props.syncOrderList();
                        props.history.push('/personal/order?lx=2');
                    }
                });
                return;
            }
            return Promise.reject();
        }).catch(reason => {
            window.alert('部分订单删除失败，请稍后重试');
        })
    }
}

function Pay(props) {
    let { payVisable = false, orderList = [], updateVisable } = props;
    if (orderList) {
        orderList = orderList.filter(item => {
            return parseInt(item.state) === 5 && item.isSelect === true;
        })
    }
    let [arr, changeArr] = useState(new Array(6).fill(null));
    return <div className="payBox" style={{
        display: payVisable ? 'block' : 'none'
    }} >
        <a className="closeBtn" onClick={ev => {
            changeArr(new Array(6).fill(null));
            updateVisable(false)
        }}>关闭</a>
        <h4>请输入支付密码</h4>
        <div className="center">
            {
                arr.map((item, index) => {
                    return <input type="password" disabled key={index} value={item !== null ? item : ''} />
                })
            }


        </div>
        <div className="keyBox" onClick={ev => {
            ev.persist();
            handle(ev, arr, changeArr, orderList, props);
        }}>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>删除</span>
            <span>0</span>
            <span>确定</span>
        </div>
    </div >

}
export default withRouter(connect(state => {
    return {
        ...state.personal,
        ...state.cart
    }
}, {
    ...actions.personal,
    ...actions.cart
})(Pay));