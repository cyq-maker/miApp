import axios from './axios';
const suffix = '/product';
export default {

    info(id) {
        return axios.get(`${suffix}/info`, {
            params: {
                id
            }
        });
    },
    list() {
        return axios.get(`${suffix}/list`);
    }

};