import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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

        // Make API call to verify token and get user data
        const response = await fetch(`/api/auth/magic-login?token=${token}`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Login failed');
        }
        
        const userData = await response.json();
        
        // Set user in Recoil state
        setUser(userData.user);
        
        // Store user in localStorage
        localStorage.setItem('user-pear', JSON.stringify(userData.user));
        
        // Navigate to the redirect path or homepage
        navigate(redirect || '/');
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
          <Spinner size="xl" color="green.500" mb={4} />
          <Text fontSize="lg">Logging you in securely...</Text>
        </Box>
      </Center>
    );
  }

  if (error) {
    return (
      <Box p={4}>
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