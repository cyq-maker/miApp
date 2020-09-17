//行为标识宏观管控，避免因单词书写的不同而导致的错误
import * as TYPES from "../action-types";

const init = {
    orderList: null,
    isSelectAll: true,
    isEdit: false,
    isEditAll: false

}

export default function cartReducer(state = init, action) {
    state = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case TYPES.CART_ORDERALL:
            state.orderList = action.payload;
            state.orderList = state.orderList.map(item => {
                item.isSelect = true;
                item.isSelectEdit = false;
                return item;
            })
            break;
        case TYPES.CART_SELECT_ALL:
            state.isSelectAll = action.flag;
            state.orderList = state.orderList.map(item => {
                if (parseInt(item.state) === 5) {
                    item.isSelect = state.isSelectAll;
                }
                return item;
            })
            break;
        case TYPES.CART_UPDATE_SELECT:
            state.orderList = state.orderList.map(item => {
                if (parseInt(item.id) === parseInt(action.index)) {
                    item.isSelect = action.flag;
                }
                return item;
            });
            const result = state.orderList.find(item => {
                return item.state === 5 && item.isSelect === false;
            })

            state.isSelectAll = result ? false : true;
            break;
        case TYPES.CART_EDIT_ALL:
            state.isEditAll = action.flag;
            state.orderList = state.orderList.map(item => {
                if (parseInt(item.state) === 5) {
                    item.isSelectEdit = state.isEditAll;
                }
                return item;
            })
            break;
        case TYPES.CART_UPDATE_EDIT_ALL:
            state.orderList = state.orderList.map(item => {
                if (parseInt(item.id) === parseInt(action.index)) {
                    item.isSelectEdit = action.flag;
                }
                return item;
            });
            const edit = state.orderList.find(item => {
                return item.state === 5 && item.isSelectEdit === false;
            })

            state.isEditAll = edit ? false : true;
            break;
        case TYPES.CART_UPDATE_EDIT:
            state.isEdit = action.flag;
            break;
        case TYPES.CART_UPDATE_COUNT:
            state.orderList = state.orderList.map(item => {
                if (parseInt(item.id) === parseInt(action.id)) {
                    item.count = action.count;
                }
                return item;
            });
            break;
        case TYPES.CART_REMOVE:
            state.orderList = state.orderList.filter(item => {

                return parseInt(item.id) !== parseInt(action.id);

            });
            break;



    }
    return state;
}