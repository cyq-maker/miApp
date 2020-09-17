import * as TYPES from '../action-types';
import api from '../../api/index';
export default {
    syncOrderList() {
        return async dispatch => {
            let data = await api.cart.list();
            if (parseInt(data.code) === 0) {
                console.log(data);
                dispatch({
                    type: TYPES.CART_ORDERALL,
                    payload: data.data
                })
            }
        }
    },
    selectAll(flag) {
        return async dispatch => {
            dispatch({
                type: TYPES.CART_SELECT_ALL,
                flag
            })
        }
    },
    updateSelect(index, flag) {
        return async dispatch => {
            dispatch({
                type: TYPES.CART_UPDATE_SELECT,
                index,
                flag
            })
        }
    },
    editAll(flag) {
        return async dispatch => {
            dispatch({
                type: TYPES.CART_EDIT_ALL,
                flag
            })
        }
    },
    updateEditAll(index, flag) {
        return async dispatch => {
            dispatch({
                type: TYPES.CART_UPDATE_EDIT_ALL,
                index,
                flag
            })
        }
    },
    updateEdit(flag) {
        console.log(flag);
        return {
            type: TYPES.CART_UPDATE_EDIT,
            flag
        }
    },
    updateCount(id, count) {
        return {
            type: TYPES.CART_UPDATE_COUNT,
            id,
            count
        }
    },
    removeCart(id) {
        return {
            type: TYPES.CART_REMOVE,
            id
        }
    }
}