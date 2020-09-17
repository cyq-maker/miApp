import * as TYPES from '../action-types';

const init = {
    cgList: null
}

export default function productReducer(state = init, action) {
    state = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case TYPES.PRO_CG:
            state.cgList = action.payload
            break;
    }
    return state;
}