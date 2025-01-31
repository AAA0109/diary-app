import axios from 'axios';
// config
import config from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
    baseURL: config.gateway.gateway_uri,
    headers: {
        'Content-Type': 'application/json',
        // 'Origin': '*',
    },
});

axiosInstance.defaults.withCredentials = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
);

export default axiosInstance;
