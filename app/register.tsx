import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Register() {
  useEffect(() => {
    router.replace('/register/personal-info');
  }, []);
  
  return null;
}
