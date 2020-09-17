import axios from './axios';
import md5 from 'blueimp-md5';
const suffix = '/';
export default {
    navList() {
        return axios.get(`${suffix}navList`)
    },
    getGoods() {
        return axios.get(`${suffix}getGoods`)
    }
}