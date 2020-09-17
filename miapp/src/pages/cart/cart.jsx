import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import HeaderNav from "../../components/HeaderNav";
import Pay from "./pay";
import actions from "../../store/actions";
import "./cart.less";
import api from "../../api";

function totalPrice(orderList) {
    if (!orderList) return 0;
    orderList = orderList.filter(item => {
        return parseInt(item.state) === 5;
    })
    if (orderList.length === 0) return 0;
    return orderList.reduce((result, item) => {
        if (item.isSelect) {
            return result + parseFloat(item.price * item.count) || 0;
        }
        return result;
    }, 0)
}
function discount(orderList) {
    if (!orderList) return 0;
    orderList = orderList.filter(item => {
        return parseInt(item.state) === 5;
    })
    if (orderList.length === 0) return 0;
    return orderList.reduce((result, item) => {
        if (item.isSelect) {
            return result + parseFloat((item.origin - item.discount) * item.count) || 0;
        }
        return result;
    }, 0)
}
function handleRemove(orderList, props) {
    if (!orderList) {
        window.alert('请选择要删除的内容');
        return;
    }
    orderList = orderList.filter(item => {
        return parseInt(item.state) === 5 && item.isSelectEdit === true;
    })
    if (orderList.length === 0) {
        window.alert('请选择要删除的内容');
        return;
    }
    //一个个删除
    async function remove(orderList) {
        if (orderList.length === 0) {
            window.alert('已删除');
            return;
        }
        const item = orderList[0];
        let result = await api.cart.remove(item.id);
        if (parseInt(result.code) === 1) {
            window.alert('删除失败，请稍后重试');
            return;
        }
        orderList.shift();
        props.removeCart(item.id);
        remove(orderList);
    }
    remove(orderList);

}
function handlePay(orderList) {
    if (!orderList) {
        window.alert('请选择要结算的内容');
        return false;
    }
    orderList = orderList.filter(item => {
        return parseInt(item.state) === 5 && item.isSelect === true
    });
    if (orderList.length === 0) {
        window.alert('请选择要结算的内容');
        return false;
    }
    return true;


}
class Cart extends React.Component {

    //支付组件所需的属性值
    state = {
        //控制组件的显示和隐藏
        payVisable: false,
        //需要支付的订单
        cartList: []
    }

    componentWillMount() {
        let userInfo = this.props.userInfo;
        if (!userInfo) {
            this.props.syncLoginInfo();
        }
    }
    render() {
        let { userInfo, orderList, syncOrderList, isSelectAll, updateSelect, selectAll, isEdit, isEditAll, editAll, updateEditAll, updateEdit } = this.props;
        let { payVisable } = this.state;

        const select = isEdit ? isEditAll : isSelectAll,
            update = isEdit ? updateEditAll : updateSelect;
        if (userInfo && !orderList) {
            syncOrderList();
        }
        if (orderList) {
            orderList = orderList.filter(item => {
                return parseInt(item.state) === 5;
            });
        }

        return <>
            <div className="cartBox">
                <HeaderNav title="购物车">
                    <div className="topEdit" onClick={ev => { updateEdit(!isEdit) }}>{isEdit ? '完成' : '编辑'}</div>
                </HeaderNav>
                {
                    !userInfo ? <div className="noTip">
                        <img src="https://trade.m.xiaomiyoupin.com/youpin/static/m/res/images/no_result/no_result_cart.png" alt="" />
                        <span>您当前未登录</span>
                        <Link to="/personal/login" className="login">立即登录</Link>
                    </div> :
                        (orderList && orderList.length > 0 ?
                            <>
                                <div className="cartList">
                                    {
                                        orderList.map(item => {
                                            const itemS = isEdit ? item.isSelectEdit : item.isSelect,
                                                itemU = isEdit ? updateEditAll : updateSelect;
                                            return <div className="cartItem" key={item.id}>
                                                <div className="cartTop" >
                                                    <span className={`iconfont  ${itemS ? 'icon-select active' : 'icon-uncheck'}`}
                                                        onClick={ev => { itemU(item.id, !itemS) }}></span>
                                                    {item.store}
                                                </div>
                                                <Link to={"/detail/" + item.id}>
                                                    <div className="cartMid">
                                                        <img src={item.pic} alt="" />
                                                        <div className="cartInfo">
                                                            <span className="cartName">{item.name}</span>
                                                            <div className="priceNum">
                                                                <span className="price">￥{item.price}</span>
                                                                <div className="numBtn">
                                                                    <span
                                                                        className={item.count === 1 ? "disable" : ''}
                                                                        onClick={ev => {
                                                                            ev.preventDefault();
                                                                            this.handle('minus', item.count, item.id);
                                                                        }}>- </span>
                                                                    <input type="text" value={item.count} onChange={ev => { }} />
                                                                    <span
                                                                        onClick={ev => {
                                                                            ev.preventDefault();
                                                                            this.handle('add', item.count, item.id);
                                                                        }}> +</span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        })
                                    }
                                </div>
                                <div className="pay">
                                    <div className="select" onClick={ev => { update(!select) }}>
                                        <span className={`iconfont  ${select ? 'icon-select active' : 'icon-uncheck'}`} ></span>
                                        <span className="word">全选</span>
                                    </div>
                                    <div className="price">
                                        {
                                            isEdit ? <button className="payBtn"
                                                onClick={ev => {
                                                    window.alert('确定要删除', {
                                                        confirm: true,
                                                        handled: type => {
                                                            if (type === 'CONFIRM') {
                                                                handleRemove(orderList, this.props);
                                                            }
                                                        }
                                                    })
                                                }}>删除</button> :
                                                <>
                                                    <div className="total">
                                                        <div> 合计 ：<span>￥{totalPrice(orderList)}</span></div>
                                                        <div className="discount">活动优惠￥{discount(orderList)}</div>
                                                    </div>
                                                    <button className="payBtn"
                                                        onClick={ev => {
                                                            if (handlePay(orderList)) {
                                                                this.updateVisable(true)
                                                            };

                                                        }}>结算</button>
                                                </>
                                        }
                                    </div>

                                </div>
                            </> :
                            <div className="noTip">
                                <img src="https://trade.m.xiaomiyoupin.com/youpin/static/m/res/images/no_result/no_result_cart.png" alt="" />
                                <span>购物车空空如也</span>
                                <Link to="/" className="login">去逛逛</Link>
                            </div>)
                }





            </div >
            <Pay payVisable={payVisable} orderList={orderList} updateVisable={this.updateVisable}></Pay>
        </>


    }
    updateVisable = flag => {
        this.setState({
            payVisable: flag
        })
    }
    handle = async (type, count, id) => {
        if (type === 'minus') {
            if (count === 1) {
                window.alert('当前订单不能再减少');
                return;
            };
            count--;
        } else {
            count++;
        }
        let data = await api.cart.update(id, count);
        if (parseInt(data.code) === 1) {
            window.alert('当前网络繁忙，请稍后重试');
            return;
        }
        //数据写入服务器，需要同步
        //同步redux是最简单的操作，但是写入数据后在拉一次数据，性能不好
        //性能好的方式：修改redux
        this.props.updateCount(id, count);
    }
}

export default connect(state => {
    return {
        ...state.personal,
        ...state.cart
    }
}, {
    ...actions.personal,
    ...actions.cart
})(Cart);