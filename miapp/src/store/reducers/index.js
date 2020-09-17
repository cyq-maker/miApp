//合并各板块的reducer
import {
    combineReducers
} from "redux";
import personalReducer from "./personalReducer";
import cartReducer from "./cartReducer";
import productReducer from "./productReducer";

const reducer = combineReducers({
    personal: personalReducer,
    cart: cartReducer,
    product: productReducer
    //状态的结构发生改变
    /*
     * 合并后的reducer后期状态也是按照模块化划分
     * state={
     *   vote:{
     *      title:'',
     *      opp:'',
     *      sup:''
     *   }
     * }
     * 调用时
     * store.getState().vote.title
     */


});
export default reducer;