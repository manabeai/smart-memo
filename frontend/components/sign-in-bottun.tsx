'use client';
import api from '@/utils/index.ts';
import { button } from '@/components/ui/button'

export const SignInButton = () => {
  const handlePost = async () => {
    try {
      const response = await api.post('/sign_ins');
      console.log('Response:', response.data);
      window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div>
      <button onClick={handlePost}>Sign In</button>
    </div>
  );
};
