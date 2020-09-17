import axios from './axios';
import md5 from 'blueimp-md5';
const suffix = '/users';
export default {
    loginPOST(name, password, type = 1) {
        return axios.post(`${suffix}/login`, {
            name,
            password: md5(password),
            type
        });
    },
    loginGET() {
        return axios.get(`${suffix}/login`);
    },
    signout() {
        return axios.get(`${suffix}/loginout`);
    },
    register(name, phone, password) {
        return axios.post(`${suffix}/register`, {
            name,
            phone,
            password: md5(password),
        });
    },
    info(id) {
        let params = {};
        if (id) {
            params.id = id;
        }
        return axios.get(`${suffix}/info`, {
            params
        });
    },
    phone(phone) {
        return axios.post(`${suffix}/phone`, {
            phone
        });
    },
    registerCode(phone) {
        return axios.post(`${suffix}/registerCode`, {
            phone
        });
    },
    loginCode(phone) {
        return axios.post(`${suffix}/loginCode`, {
            phone
        });
    },
    checkCode(phone, code) {
        return axios.post(`${suffix}/checkCode`, {
            phone,
            code: md5(code)
        });
    }
};