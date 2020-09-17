import React from 'react';
import './home.less';
import Swiper from 'swiper/package/js/swiper';
import api from '../../api';
class Home extends React.Component {
    state = {
        dataList: [],
        goodsList: [],
        navBar: ['推荐', '智能', '电器', '生活', '时尚', '特惠'],
        navIndex: 0
    }

    componentWillMount() {
        this.getNav();
        this.getGoods();
    }
    componentDidMount() {
        new Swiper('.swiper-container', {
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: true

        })
    }


    render() {
        let goods = null;
        let { dataList, navBar, navIndex, goodsList } = this.state;
        let swiperImg = [{
            "img": "https://img.youpin.mi-img.com/test/975f65ed96171ca24d260b6f89abe6bf.jpeg@base@tag=imgScale&h=320&w=750",
            "color": "#f2151e"
        }, {
            "img": "https://img.youpin.mi-img.com/test/495aec2233b1c83f8c5675e84d1e6482.jpeg@base@tag=imgScale&h=320&w=750",
            "color": "#fb6a4d"
        }, {
            "img": "https://img.youpin.mi-img.com/test/4ffed4fd49b7afbc761a816ed9af1eac.jpeg@base@tag=imgScale&h=320&w=750",
            "color": "#e7772b"
        }, {
            "img": "https://img.youpin.mi-img.com/test/a6bae9ee467c9cb918e315c6c25d214e.jpeg@base@tag=imgScale&h=320&w=750",
            "color": "#ff6e00"
        }];
        if (goodsList) {
            goods = goodsList.filter(item => {
                return parseInt(item.nav) === navIndex;
            });
        }

        console.log(goods);
        return <div className="homeBox" >
            <header className="header">
                <img src="https://img.youpin.mi-img.com/static/weex_images/v1/m/navi_title_v6.png" alt="" />
                <i className="iconfont icon-sousuo"></i>
                <input type="text" />
            </header>
            <div className="swiper" id="swiper" >
                <div className="swiper-container" >
                    <div className="swiper-wrapper" >
                        {
                            swiperImg.map(item => {
                                return <div className="swiper-slide" >
                                    <img src={item.img} alt="" />
                                </div>
                            })
                        }
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </div>
            <div className="content">
                <div className="navBox">
                    {

                        dataList ? <div className="nav">
                            {
                                dataList.map(item => {
                                    return <div className="nav-item">
                                        <img src={item.img} alt="" />
                                        <span>{item.title}</span>
                                    </div>
                                })
                            }
                        </div> : null
                    }
                </div>
                <div className="goods">
                    <div className="navBar">
                        {
                            navBar.map((item, index) => {
                                return <span className={index === navIndex ? 'navItem active' : 'navItem'} onClick={ev => {
                                    this.setState({
                                        navIndex: index
                                    })
                                }}>{item}</span>
                            })
                        }
                    </div>
                    <div className="goodsList">
                        {
                            goods.map((item, index) => {
                                return <div className="goodsItem">
                                    <img src={item.images} alt="" />
                                    <div className="goodsDetail">
                                        <div className="title">{item.title}</div>
                                        <div className="text">{item.text}</div>
                                        <div className="price">￥ {item.discount ? item.discount : item.origin}</div>
                                    </div>
                                </div>
                            })
                        }
                    </div>

                </div>
            </div>

        </div>
    }
    getNav = async () => {
        let data = await api.home.navList();
        if (parseInt(data.code) !== 0) {
            window.alert('网络繁忙，请稍后重试');
            return;
        }

        this.setState({
            dataList: data.data
        })

    }
    getGoods = async () => {
        let data = await api.home.getGoods();
        if (parseInt(data.code) !== 0) {
            window.alert('网络繁忙，请稍后重试');
            return;
        }

        this.setState({
            goodsList: data.data
        })

    }
}
export default Home;