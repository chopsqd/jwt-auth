import axios from 'axios'

export const API_URL = `http://localhost:5000/api`

const $api = axios.create({
    // Автоматически цеплять cookie к каждому запросу
    withCredentials: true,
    baseURL: API_URL
})

// Реализуем interceptor (перехватчик) 401 кода
$api.interceptors.request.use((config) => {
    if (!config) config = {}
    if (!config.headers) config.headers = {}

    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

export default $api