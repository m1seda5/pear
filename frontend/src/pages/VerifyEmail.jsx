// VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const bgColor = useColorModeValue('white', 'gray.dark');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/users/verify-email/${id}`);
        const data = await res.json();

        if (data.error) {
          showToast('Error', data.error, 'error');
        } else {
          showToast('Success', data.message, 'success');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        showToast('Error', error.message, 'error');
      } finally {
        setVerifying(false);
      }
    };

    if (id) {
      verifyEmail();
    }
  }, [id, navigate, showToast]);

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={6}
      borderRadius="lg"
      bg={bgColor}
      boxShadow="lg"
    >
      <VStack spacing={4}>
        <Heading size="lg">Email Verification</Heading>
        {verifying ? (
          <>
            <Spinner size="xl" />
            <Text>Verifying your email...</Text>
          </>
        ) : (
          <Text>Email verification complete! Redirecting to login...</Text>
        )}
      </VStack>
    </Box>
  );
};

export default VerifyEmail;