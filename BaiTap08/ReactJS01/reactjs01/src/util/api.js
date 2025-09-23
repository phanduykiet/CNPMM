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
const getFiltersApi = () => {
  const URL_API = "/v1/api/get-filter";
  return axios.get(URL_API);
};
const getLessonDetailApi = (id) => {
    const URL_API = `/v1/api/lesson/${id}`;
    return axios.get(URL_API);
};
const getSimilarLessonsApi = (id, limit) => {
    const URL_API = `/v1/api/lessons/${id}/similar?limit=${limit}`;
    return axios.get(URL_API);
}
const getInfoLessonApi = (id) => {
    const URL_API = `/v1/api/lessons/${id}/counts`;
    return axios.get(URL_API);
}
const increaseViewApi = (id) => {
    const URL_API = `/v1/api/lessons/${id}/view`;
    return axios.post(URL_API, id);
}
const addToFavoriteApi = (lessonId, userId) => {
    const URL_API = `/v1/api/lessons/${lessonId}/favorite`;
    return axios.post(URL_API, { userId });
}
const removeToFavoriteApi = (lessonId, userId) => {
    const URL_API = `/v1/api/lessons/${lessonId}/unfavorite`;
    return axios.post(URL_API, { userId });
}
const getFavoriteLessonApi = (id, page, limit) => {
    const URL_API = `/v1/api/users/${id}/favorites?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
}
const addCommentApi  = (lessonId, userId, content) => {
    const URL_API = `/v1/api/lessons/${lessonId}/add-comments`;
    return axios.post(URL_API, { userId, content });
}
const getCommentApi = (lessonId) => {
    const URL_API = `/v1/api/lessons/${lessonId}/get-comments`;
    return axios.get(URL_API);
};

export {
    createUserApi, loginApi, getUserApi, getLessonsApi, getFiltersApi, getLessonDetailApi, getSimilarLessonsApi, getInfoLessonApi, increaseViewApi,
    addToFavoriteApi, getFavoriteLessonApi, removeToFavoriteApi, addCommentApi, getCommentApi
}