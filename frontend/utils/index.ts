import Axios from 'axios';

// export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = Axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
});

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response);

        // レスポンスのヘッダーにクッキーが含まれているか確認
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            console.log('生成されたクッキー:', setCookieHeader);
        } else {
            console.log('クッキーは生成されていません。');
        }
        return response; 
    },
    (error) => {
    // レスポンスの内容を表示
        console.error('Error Response:', error);
        // window.location.href = '/sign_ins';  
        return Promise.reject(error);
    }
);

export default api;
