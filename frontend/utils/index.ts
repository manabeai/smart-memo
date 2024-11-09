import Axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRERT = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

export const api = Axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    // timeout: 10000000,
    headers: {
        'Content-Type': 'application/json'
        // 'Access-Control-Allow-Origin': 'http://localhost:3000'
    },
});

api.interceptors.request.use(config => {
    if (localStorage.hasOwnProperty('SmartMemoJwtToken')) {
        const token = localStorage.getItem('SmartMemoJwtToken');
        config.withCredentials = true;
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        // レスポンスのヘッダーにクッキーが含まれているか確認
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            console.log('生成されたクッキー:', setCookieHeader);
        } else {
            console.log('クッキーは生成されていません。');
        }
        return response; // レスポンスを返す
    },
    (error) => {
        return Promise.reject(error); // エラーを返す
    }
);

export default api;
