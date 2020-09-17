import * as TYPES from '../action-types';
import api from '../../api/index';
export default {
    loginSuccess(data) {
        return {
            type: TYPES.PERSONAL_LOGN_SUCCESS,
            payload: data
        };
    },
    syncLoginInfo() {
        return async dispatch => {
            let data = await api.personal.loginGET();
            if (parseInt(data.code) !== 0) {
                dispatch({
                    type: TYPES.PERSONAL_LOGN_INFO,
                    isLogin: false
                });
                return;
            }
            data = await api.personal.info();
            if (parseInt(data.code) === 0) {
                dispatch({
                    type: TYPES.PERSONAL_LOGN_INFO,
                    isLogin: true,
                    userInfo: data.data
                });
            }
        }
    },
    resetUserInfo() {
        return {
            type: TYPES.PERSONAL_LOGN_INFO,
            isLogin: false,
            userInfo: null
        };
    }
}