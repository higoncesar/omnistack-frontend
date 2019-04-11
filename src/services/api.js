import axios from 'axios';

const api = axios.create({
    baseURL: 'https://omnistack-higon.herokuapp.com',
});

export default api;