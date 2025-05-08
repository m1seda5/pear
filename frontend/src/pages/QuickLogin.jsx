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

        const data = await res.json();
        
        if (data.error) {
          toast({
            title: data.error,
            status: "error",
            duration: 3000,
          });
          navigate('/auth');
          return;
        }

        // If successful, the backend will have set the cookie
        // and redirected to the appropriate page
        localStorage.setItem("user-threads", JSON.stringify(data));
        setUser(data);
        
        // The backend will handle the redirect to the appropriate page
        // We don't need to navigate here as the backend response will include
        // the redirect
      } catch (error) {
        console.error('Quick login error:', error);
        toast({
          title: "Failed to process quick login",
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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <VStack spacing={4}>
        {isLoading ? (
          <>
            <Spinner size="xl" />
            <Text>Logging you in...</Text>
          </>
        ) : null}
      </VStack>
    </Box>
  );
};

export default QuickLogin; 