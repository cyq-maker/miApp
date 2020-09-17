import * as TYPES from '../action-types';
import api from '../../api/index';
export default {
    syncCgList() {
        return async dispatch => {
            let data = await api.product.list();
            if (parseInt(data.code) === 0) {
                console.log(data);
                dispatch({
                    type: TYPES.PRO_CG,
                    payload: data.data
                })
            }
        }
    }
}