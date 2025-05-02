import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Text, useToast
} from '@chakra-ui/react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", status: 'error', duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      
      const data = await res.json();
      if (data.error) {
        toast({ title: data.error, status: 'error', duration: 3000 });
        return;
      }

      toast({ 
        title: "Password reset successfully!", 
        status: 'success', 
        duration: 3000 
      });
      navigate('/auth');
    } catch (error) {
      toast({ title: "An error occurred", status: 'error', duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Text fontSize="2xl" mb={4}>Reset Your Password</Text>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={4}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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