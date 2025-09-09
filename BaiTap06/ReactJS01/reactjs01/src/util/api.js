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

const getLessonsApi = (page = 1, limit = 5, subject = "", category = "") => {
    const URL_API = "/v1/api/lessons";
    return axios.get(URL_API, {
        params: { page, limit, subject, category }
    });
};

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}
export {
    createUserApi, loginApi, getUserApi, getLessonsApi
}