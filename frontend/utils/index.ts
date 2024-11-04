import Axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// api.interceptors.request.use(
//     (config) => {
//         // 認証トークンを取得（ローカルストレージやセッションストレージから）
//         const token = localStorage.getItem('authToken'); // 例としてローカルストレージから取得

//         if (token) {
//             // ヘッダーにトークンを追加
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }

//         return config; // 必ずconfigを返す
//     },
//     (error) => {
//         // エラーがあった場合はエラーを返す
//         return Promise.reject(error);
//     }
// );

export default api;