//行为标识宏观管控，避免因单词书写的不同而导致的错误
import * as TYPES from "../action-types";

const init = {
    isLogin: false,
    userInfo: null

}

export default function personalReducer(state = init, action) {
    state = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case TYPES.PERSONAL_LOGN_SUCCESS:
            state.isLogin = true;
            state.userInfo = action.payload;
            break;
        case TYPES.PERSONAL_LOGN_INFO:
            state.isLogin = action.isLogin;
            state.userInfo = action.userInfo || null;
            break;
    }
    return state;
}