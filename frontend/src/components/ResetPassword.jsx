import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Text, useToast
} from '@chakra-ui/react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await fetch(`/api/users/reset-password/${token}`);
        if (!res.ok) throw new Error('Invalid token');
        setIsValidToken(true);
      } catch (error) {
        toast({
          title: 'Invalid or expired reset link',
          status: 'error',
          duration: 5000,
        });
        navigate('/login');
      }
    };
    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast({
        title: 'Password reset successful!',
        status: 'success',
        duration: 5000,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: error.message || 'Password reset failed',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) return null;

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Text fontSize="2xl" mb={4}>Set New Password</Text>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={4}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          isLoading={isSubmitting}
          colorScheme="blue"
          width="full"
        >
          Reset Password
        </Button>
      </form>
    </Box>
  );
}