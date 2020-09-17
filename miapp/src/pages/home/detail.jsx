import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import "./detail.less";
import api from "../../api/index";
import Swiper from 'swiper/package/js/swiper';
import actions from '../../store/actions/index';

function Detail(props) {
    let { history } = props;

    //获取详情信息
    const [data, changeData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            const id = props.match.params ? props.match.params.id : 0;
            let data = await api.product.info(id);
            if (parseInt(data.code) === 0) {
                changeData(data.data);
                return;
            }
            window.alert("获取商品详情失败，请检查地址是否有效");
        }
        fetchData();
    }, [])
    //swiper
    useEffect(() => {
        if (data) {
            new Swiper('.detailSwiper', {
                loop: true,
                pagination: '.swiper-pagination',

                paginationClickable: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true//修改swiper的父元素时，自动初始化swiper

            });
        }
    }, [data]);

    //验证是否登录
    const userInfo = props.personal.userInfo;
    useEffect(() => {
        if (!userInfo) {
            props.syncLoginInfo();
        }
    }, []);

    //同步订单信息
    let orderList = props.cart.orderList;
    if (userInfo) {
        if (!orderList) {
            props.syncOrderList();
        }
    }
    //在所有订单信息中状态为5的
    if (orderList) {
        console.log(orderList);
        orderList = orderList.filter(item => {
            return parseInt(item.state) === 5;
        });
    }
    async function handle(type) {
        if (!userInfo) {
            window.alert("请您先登录");
            history.push('/personal/login');
            return;
        }
        //加入购物车
        let result = await api.cart.add(data.id);
        console.log(result);
        if (parseInt(result.code) !== 0) {
            window.alert('网络繁忙，请稍后再试');
            return;
        }
        props.syncOrderList();
    }

    return <>
        {data ? <div className="detailBox">

            <div className="swiper-container detailSwiper">
                <div className="swiper-wrapper">
                    {data.images.map((item, index) => {
                        return <div className="swiper-slide" key={index}>
                            <img src={item} alt="" />
                        </div>
                    })}
                    {/* <div className="swiper-slide" >
                        <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/f7f594a1e238140d008d3d6d545ae379.jpg?w=1080&h=2000&bg=D8F9FF" alt="" />
                    </div>
                    <div className="swiper-slide">
                        <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/f7f594a1e238140d008d3d6d545ae379.jpg?w=1080&h=2000&bg=D8F9FF" alt="" />
                    </div> */}

                </div>
                <div className="swiper-pagination swiper-pagination-bullets">
                    <span className="swiper-pagination-bullets"></span>
                </div>

            </div>
            <div className="info">
                <div className="price">
                    {data.discount ?
                        <>
                            <span className="present">￥{data.discount}</span>
                            <span className="origin">￥{data.origin}</span>
                        </> :
                        <span className="present">￥{data.origin}</span>}
                </div>
                <h5 className="title">{data.title}</h5>
                <p className="desc">{data.detail.text}</p>
            </div>
            <div className="desImg">
                {
                    data.detail.images.map((item, index) => {
                        return <img src={item} key={index} />;
                    })
                }
            </div>
            <div className="topBtn">
                <a className="iconfont icon-return" onClick={ev => {
                    props.history.go(-1);
                }}></a>
                <a className="iconfont icon-home" onClick={ev => {
                    props.history.push('/');
                }}></a>
            </div>
            <div className="bottomBtn">
                <a href="" className="cart" onClick={ev => {
                    props.history.push('/cart')
                }}>
                    {orderList && orderList.length ? <span className="num">
                        {
                            // console.log(orderList)
                            orderList.reduce((result, item) => {
                                return result + parseInt(item.count);
                            }, 0)
                        }</span> : null}
                    <span className="iconfont icon-cart"></span>
                    <span>购物车</span>
                </a>
                <div className="btnGroup">
                    <button className="addCart" onClick={ev => {
                        handle('ADD')
                    }}>加入购物车</button>
                    <button className="buyNow" onClick={ev => {
                        handle('BUY')
                    }}>立即购买</button>
                </div>
            </div>
        </div> : null
        }
    </>
}

export default connect(state => state, {
    ...actions.personal,
    ...actions.cart
})(Detail);