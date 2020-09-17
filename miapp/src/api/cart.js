import axios from './axios';
import md5 from 'blueimp-md5';
const suffix = '/cart';
export default {
    list(id = 0) {
        return axios.post(`${suffix}/list`, {
            id
        })
    },
    add(id, count = 1) {
        return axios.post(`${suffix}/add`, {
            id,
            count
        });
    },
    update(id, count = 1) {
        return axios.post(`${suffix}/update`, {
            id,
            count
        });
    },
    remove(id) {
        return axios.post(`${suffix}/remove`, {
            id
        });
    },
    payPass(password) {
        return axios.post(`${suffix}/payPass`, {
            password: md5(password)
        });
    },
    state(id, state = 2) {
        return axios.post(`${suffix}/state`, {
            id,
            state
        });
    }
}