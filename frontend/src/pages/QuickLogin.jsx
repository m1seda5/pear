import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

const QuickLogin = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processQuickLogin = async () => {
      try {
        if (!token) {
          toast({
            title: "No login token provided",
            status: "error",
            duration: 3000,
          });
          navigate('/auth');
          return;
        }

        const res = await fetch(`/api/quick-login?token=${token}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to process quick login');
        }

        const data = await res.json();
        
        // Store user data in localStorage and state
        localStorage.setItem("user-threads", JSON.stringify(data.user));
        setUser(data.user);
        
        // Navigate to the redirect path
        if (data.redirectPath) {
          navigate(data.redirectPath);
        } else {
          navigate('/');
        }

        toast({
          title: "Successfully logged in",
          status: "success",
          duration: 3000,
        });
      } catch (error) {
        console.error('Quick login error:', error);
        toast({
          title: error.message || "Failed to process quick login",
          status: "error",
          duration: 3000,
        });
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    processQuickLogin();
  }, [token, navigate, setUser, toast]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Processing login...</Text>
        </VStack>
      </Box>
    );
  }

  return null;
};

export default QuickLogin; 