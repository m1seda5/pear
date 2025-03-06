import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, Center, Alert, AlertIcon } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

const MagicLogin = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const redirect = searchParams.get('redirect');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();
  
  useEffect(() => {
    const performMagicLogin = async () => {
      try {
        if (!token) {
          setError('Invalid login link. Please try logging in normally.');
          setLoading(false);
          return;
        }
        
        // Make API call to verify token
        const response = await fetch(`/api/users/magic-login?token=${token}&redirect=${redirect || '/'}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }
        
        // Parse the response JSON
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Authentication failed');
        }
        
        // Set user in Recoil state
        setUser(data.user);
        
        // Store user in localStorage
        localStorage.setItem('user-pear', JSON.stringify(data.user));
        
        // Navigate to the redirect path from the response or the URL parameter
        navigate(data.redirectUrl || redirect || '/');
      } catch (err) {
        console.error('Magic login error:', err);
        setError(err.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    };
    
    performMagicLogin();
  }, [token, redirect, setUser, navigate]);
  
  if (loading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <img src="/pear.png" alt="Pear Logo" width={60} height={60} style={{ margin: '0 auto 20px' }} />
          <Spinner size="xl" color="green.500" mb={4} />
          <Text fontSize="lg">Logging you in securely...</Text>
        </Box>
      </Center>
    );
  }
  
  if (error) {
    return (
      <Box p={4}>
        <img src="/pear.png" alt="Pear Logo" width={60} height={60} style={{ margin: '0 auto 20px', display: 'block' }} />
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
        <Text mt={4}>
          Please try <a href="/auth" style={{ color: '#4CAF50', textDecoration: 'underline' }}>logging in</a> normally.
        </Text>
      </Box>
    );
  }
  
  return null;
};

export default MagicLogin;