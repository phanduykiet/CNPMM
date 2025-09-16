import axios from './axios.customize';
const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data)
}
const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}
const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}
const getLessonsApi = (page = 1, limit = 5, subject = "", category = "", search = "") => {
    const URL_API = "/v1/api/lessons";
    return axios.get(URL_API, {
        params: { page, limit, subject, category, search }
    });
};
export {
    createUserApi, loginApi, getUserApi, getLessonsApi
}