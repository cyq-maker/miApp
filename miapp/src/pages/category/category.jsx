import React, { useEffect } from 'react';
import { connect } from 'react-redux';


import './category.less';
import personal from '../../api/personal';
import actions from '../../store/actions';
import api from '../../api';

class Category extends React.Component {

    state = {
        active: 1,
        cgIndex: 0,
    }
    componentWillMount() {
        this.props.syncCgList();
    }




    render() {

        let { userInfo, cgList, syncCgList } = this.props;
        let { active, cgIndex } = this.state;
        let nav;

        cgList = cgList || [];
        let dataList = cgList[cgIndex];
        // let dataList = [];
        // dataList.push(arr[cgIndex])






        return <div className="categoryBox" >
            <header className="header">
                <i className="iconfont icon-sousuo"></i>
                <input type="text" />


            </header>

            <div className="cg" ref="cg" id='cg' onScroll={ev => {

                let height = this.refs.cg.clientHeight,
                    clientHeight = document.documentElement.clientHeight,
                    scrollHeight = window.pageYOffset;
                console.log(clientHeight, height, scrollHeight);
                if (height > clientHeight && scrollHeight === clientHeight + scrollHeight - 50) {
                    console.log(1);
                    this.setState({
                        cgIndex: cgIndex + 1
                    })
                }

            }}>
                <div className="cgNav">
                    {


                        (cgList || []).map((item, index) => {
                            return <>
                                <div className="navItem" onClick={ev => {
                                    this.setState({
                                        active: parseInt(item.id),
                                        cgIndex: parseInt(item.id) - 1
                                    });
                                    // nav = `nav${item.id}`;
                                    // this.refs[nav].scrollIntoView();
                                }}>
                                    <span className={item.id === active ? "navActive" : ''}>{item.name}</span>
                                </div>
                            </>
                        })
                    }
                </div>

                <div className="cgPro" ref="cgPro">
                    {/* <div style={{ "height": "30px", "width": "100%" }}></div> */}
                    {
                        dataList ? <div className="proArea" ref='proArea'>
                            {

                                dataList.children.map(item => {


                                    return <div className="proItem">
                                        <span className="title">{item.name}</span>
                                        <div className="cgDetail">
                                            {
                                                (item.children || []).map(item => {
                                                    return <div className="cgItem">
                                                        <img src={item.img} alt="" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                })
                                            }
                                        </div>


                                    </div>


                                })
                                // (dataList || []).map(item => {
                                //     return <div className="proArea" ref={`nav${item.id}`}>
                                //         {
                                //             (item.children || []).map(item => {
                                //                 return <>
                                //                     <div className="proItem">
                                //                         <span className="title">{item.name}</span>
                                //                         <div className="cgDetail">
                                //                             {
                                //                                 (item.children || []).map(item => {
                                //                                     return <div className="cgItem">
                                //                                         <img src={item.img} alt="" />
                                //                                         <span>{item.name}</span>
                                //                                     </div>
                                //                                 })
                                //                             }
                                //                         </div>


                                //                     </div>
                                //                 </>
                                //             })
                                //         }
                                //     </div>
                                // })
                            }


                        </div> : null
                    }
                </div>
            </div>
        </div >


    }



}



export default connect(state => {
    return {
        ...state.personal,
        ...state.product
    }
}, {
    ...actions.peresonal,
    ...actions.product
})(Category);