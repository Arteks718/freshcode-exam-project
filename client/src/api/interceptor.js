import axios from 'axios';
import CONTANTS from '../constants';
import history from '../browserHistory';
import resetUser from '../utils/resetUser';

const instance = axios.create({
  baseURL: CONTANTS.BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(CONTANTS.ACCESS_TOKEN);
    if (token) {
      config.headers = { ...config.headers, Authorization: token };
    }
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      window.localStorage.setItem(CONTANTS.ACCESS_TOKEN, response.data.token);
    }
    return response;
  },
  (err) => {
    if (
      err.response.status === 408 &&
      !CONTANTS.PUBLIC_LOCATIONS.includes(window.location.pathname)
    ) {
      resetUser(history);
    }
    return Promise.reject(err);
  }
);

export default instance;
