// "use client";
import { useGoogleLogin } from '@react-oauth/google';
import api from '@/utils/index';

export default function GoogleLoginButton() {
  const googleLogin = useGoogleLogin({
    onSuccess: async (res) => {
        try {
          // `access_token`を`URLSearchParams`でエンコード
          const formData = new URLSearchParams();
          formData.append('access_token', res.access_token); // Googleから取得したアクセストークン
          
          const response = await api.post('/auth/google_oauth2', formData, {
            baseURL: 'http://localhost:3000',
            withCredentials: true,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
              // 'Access-Control-Allow-Origin': 'http://localhost:4000'
            }

          });
          
          localStorage.setItem('SmartMemoJwtToken', response.data.jwt);
          console.log("Googleログイン成功");
      } catch (error) {
          console.error("Googleログインエラー:", error);
      }
    },
    onError: () => {
      console.log("Googleログイン失敗");
    },
  });

  return (
    <button
      onClick={() => googleLogin()}
      className="bg-blue-500 text-white py-2 px-4 rounded mb-6"
    >
      Googleでログイン
    </button>
  );
}
