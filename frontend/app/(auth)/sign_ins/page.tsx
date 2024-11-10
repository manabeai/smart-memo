// app/(auth)/sign_ins/page.tsx
'use client';

import api from '@/utils/index.ts';

const SignInPage = () => {
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

export default SignInPage;
