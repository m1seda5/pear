import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  Box, Button, FormControl, FormLabel, Input, Text, useToast
} from '@chakra-ui/react';
import authScreenAtom from '../atoms/authAtom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      toast({
        title: data.message || 'If an account exists, a reset email has been sent',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      
      setAuthScreen('login');
    } catch (error) {
      toast({
        title: 'Error sending reset email',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Text fontSize="2xl" mb={4}>Reset Password</Text>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={4}>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          isLoading={isSubmitting}
          colorScheme="blue"
          width="full"
        >
          Send Reset Link
        </Button>
        <Button
          mt={2}
          width="full"
          onClick={() => setAuthScreen('login')}
        >
          Back to Login
        </Button>
      </form>
    </Box>
  );
}