import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // потом поменять на нужный порт
  withCredentials: false
});

api.interceptors.response.use(
  response => response,

  error => {
    // ошибка сети или сервер недоступен
    if (!error.response) {
      window.location.href = "/error/network";
      return Promise.reject(error);
    }

    // ошибка 500+
    if (error.response.status >= 500) {
      window.location.href = "/error/500";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
