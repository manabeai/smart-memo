import Axios from 'axios';

const API_URL = 'http://localhost:4000';

export const api = Axios.create({
    baseURL: API_URL,
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
        if (error.response) {
          // サーバーがエラーコードで応答した場合
          console.error('Error Response:', error.response);
        } else if (error.request) {
          console.error('ネットワークエラー: サーバーからの応答がありません', error.request);
        } else {
          console.error('リクエスト設定エラー:', error.message);
        }
        return Promise.reject(error);
      }
);

export default api;
