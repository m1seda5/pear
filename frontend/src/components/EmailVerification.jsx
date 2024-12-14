import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  VStack, 
  Text, 
  Button, 
  Alert, 
  AlertIcon, 
  Box 
} from '@chakra-ui/react';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/users/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [location]);

  const renderVerificationStatus = () => {
    switch(verificationStatus) {
      case 'success':
        return (
          <Alert status="success">
            <AlertIcon />
            Email verified successfully! You can now log in.
            <Button 
              ml={4} 
              colorScheme="green"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </Alert>
        );
      case 'error':
        return (
          <Alert status="error">
            <AlertIcon />
            Email verification failed. Please try signing up again or contact support.
          </Alert>
        );
      default:
        return <Text>Verifying your email...</Text>;
    }
  };

  return (
    <VStack spacing={4} align="center" width="full">
      <Box width="full" maxWidth="400px">
        {renderVerificationStatus()}
      </Box>
    </VStack>
  );
};

export default EmailVerification;