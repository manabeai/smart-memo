'use client';
import api from '@/utils/index';
import { Button } from "@/components/ui/button";
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
      <Button variant="outline" > サインイン</Button>
      <button onClick={handlePost}>Sign In</button>
    </div>
  );
};
