// version one without language switcher
// import { Button, Text } from "@chakra-ui/react";
// import useShowToast from "../hooks/useShowToast";
// import useLogout from "../hooks/useLogout";

// export const SettingsPage = () => {
// 	const showToast = useShowToast();
// 	const logout = useLogout();

// 	const freezeAccount = async () => {
// 		if (!window.confirm("Are you sure you want to freeze your account?")) return;

// 		try {
// 			const res = await fetch("/api/users/freeze", {
// 				method: "PUT",
// 				headers: { "Content-Type": "application/json" },
// 			});
// 			const data = await res.json();

// 			if (data.error) {
// 				return showToast("Error", data.error, "error");
// 			}
// 			if (data.success) {
// 				await logout();
// 				showToast("Success", "Your account has been frozen", "success");
// 			}
// 		} catch (error) {
// 			showToast("Error", error.message, "error");
// 		}
// 	};

// 	return (
// 		<>
// 			<Text my={1} fontWeight={"bold"}>
// 				Freeze Your Account
// 			</Text>
// 			<Text my={1}>You can unfreeze your account anytime by logging in.</Text>
// 			<Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
// 				Freeze
// 			</Button>
// 		</>
// 	);
// };


// version 2 working version with change of langauge feature 
// import React from 'react';
// import { Button, Text } from '@chakra-ui/react';
// import useShowToast from '../hooks/useShowToast';
// import useLogout from '../hooks/useLogout';
// import i18n from '../i18n'; // Import i18n

// export const SettingsPage = () => {
//   const showToast = useShowToast();
//   const logout = useLogout();

//   const freezeAccount = async () => {
//     if (!window.confirm(i18n.t("Are you sure you want to freeze your account?"))) return;

//     try {
//       const res = await fetch('/api/users/freeze', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const data = await res.json();

//       if (data.error) {
//         return showToast('Error', data.error, 'error');
//       }
//       if (data.success) {
//         await logout();
//         showToast('Success', i18n.t('Your account has been frozen'), 'success');
//       }
//     } catch (error) {
//       showToast('Error', error.message, 'error');
//     }
//   };

//   const handleLanguageChange = (lng) => {
//     i18n.changeLanguage(lng);
//     localStorage.setItem('language', lng);
//   };

//   return (
//     <>
//       <Text my={1} fontWeight={'bold'}>
//         {i18n.t('Freeze Your Account')}
//       </Text>
//       <Text my={1}>
//         {i18n.t('You can unfreeze your account anytime by logging in.')}
//       </Text>
//       <Button size={'sm'} colorScheme='red' onClick={freezeAccount}>
//         {i18n.t('Freeze')}
//       </Button>
//       <Button onClick={() => handleLanguageChange('en')}>English</Button>
//       <Button onClick={() => handleLanguageChange('zh')}>中文</Button>
//     </>
//   );
// };

// version 3   pauseeeeeee this is woring witht the langauge changer butons only working in the settings thoughb
// import React from 'react';
// import { Button, Text, Spinner } from '@chakra-ui/react';
// import useShowToast from '../hooks/useShowToast';
// import useLogout from '../hooks/useLogout';
// import i18n from '../i18n'; // Import i18n

// export const SettingsPage = () => {
//   const showToast = useShowToast();
//   const logout = useLogout();
//   const [loading, setLoading] = React.useState(false);

//   const freezeAccount = async () => {
//     if (!window.confirm(i18n.t("Are you sure you want to freeze your account?"))) return;

//     try {
//       const res = await fetch('/api/users/freeze', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const data = await res.json();

//       if (data.error) {
//         return showToast('Error', data.error, 'error');
//       }
//       if (data.success) {
//         await logout();
//         showToast('Success', i18n.t('Your account has been frozen'), 'success');
//       }
//     } catch (error) {
//       showToast('Error', error.message, 'error');
//     }
//   };

//   const handleLanguageChange = (lng) => {
//     setLoading(true);
//     i18n.changeLanguage(lng).then(() => {
//       localStorage.setItem('language', lng);
//       setLoading(false);
//     });
//   };

//   return (
//     <>
//       <Text my={1} fontWeight={'bold'}>
//         {i18n.t('Freeze Your Account')}
//       </Text>
//       <Text my={1}>
//         {i18n.t('You can unfreeze your account anytime by logging in.')}
//       </Text>
//       <Button size={'sm'} colorScheme='red' onClick={freezeAccount}>
//         {i18n.t('Freeze')}
//       </Button>
//       {loading ? (
//         <Spinner size="sm" />
//       ) : (
//         <>
//           <Button
//             onClick={() => handleLanguageChange('en')}
//             mx={2} // Add horizontal spacing
//             _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }} // Add hover animation
//           >
//             English
//           </Button>
//           <Button
//             onClick={() => handleLanguageChange('zh')}
//             mx={2} // Add horizontal spacing
//             _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }} // Add hover animation
//           >
//             中文
//           </Button>
//         </>
//       )}
//     </>
//   );
// };



// slight update to th settings for the langauge changer 
// import React from 'react';
// import { Button, Text, Spinner } from '@chakra-ui/react';
// import useShowToast from '../hooks/useShowToast';
// import useLogout from '../hooks/useLogout';
// import i18n from '../i18n'; // Import i18n

// export const SettingsPage = () => {
//   const showToast = useShowToast();
//   const logout = useLogout();
//   const [loading, setLoading] = React.useState(false);

//   const freezeAccount = async () => {
//     if (!window.confirm(i18n.t("Are you sure you want to freeze your account?"))) return;

//     try {
//       const res = await fetch('/api/users/freeze', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const data = await res.json();

//       if (data.error) {
//         return showToast('Error', data.error, 'error');
//       }
//       if (data.success) {
//         await logout();
//         showToast('Success', i18n.t('Your account has been frozen'), 'success');
//       }
//     } catch (error) {
//       showToast('Error', error.message, 'error');
//     }
//   };

//   const handleLanguageChange = (lng) => {
//     setLoading(true);
//     i18n.changeLanguage(lng).then(() => {
//       localStorage.setItem('language', lng);
//       setLoading(false);
//     });
//   };

//   return (
//     <>
//       <Text my={1} fontWeight={'bold'}>
//         {i18n.t('Freeze Your Account')}
//       </Text>
//       <Text my={1}>
//         {i18n.t('You can unfreeze your account anytime by logging in.')}
//       </Text>
//       <Button size={'sm'} colorScheme='red' onClick={freezeAccount}>
//         {i18n.t('Freeze')}
//       </Button>
//       {loading ? (
//         <Spinner size="sm" />
//       ) : (
//         <>
//           <Button
//             onClick={() => handleLanguageChange('en')}
//             mx={2}
//             _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }}
//           >
//             English
//           </Button>
//           <Button
//             onClick={() => handleLanguageChange('zh')}
//             mx={2}
//             _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }}
//           >
//             中文
//           </Button>
//         </>
//       )}
//     </>
//   );
// };


// post notis 
import React, { useState } from 'react';
import { Button, Text, Spinner, Switch, HStack, VStack, Box, useColorMode, useColorModeValue } from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import useLogout from '../hooks/useLogout';
import i18n from '../i18n';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

export const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();
  const [loading, setLoading] = React.useState(false);
  const { colorMode, setColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom);
  const [notifications, setNotifications] = React.useState({
    email: true,
    webPush: true,
  });
  const [isToggling, setIsToggling] = React.useState(false);
  const [isPinkMode, setIsPinkMode] = useState(() => localStorage.getItem('pinkMode') === 'true');
  
  // Check if user is admin or the specific user
  const canChangeColorMode = currentUser?.role === 'admin' || 
    (currentUser?.email === 'skaroki@students.brookhouse.ac.ke' && currentUser?.username === 'sarakaroki');

  // Fetch initial notification preferences when component mounts
  React.useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        const data = await res.json();
        if (data.error) {
          console.error('Error fetching user data:', data.error);
          return;
        }
        setNotifications({
          email: data.emailNotifications,
          webPush: data.webPushNotifications,
        });
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      }
    };

    fetchNotificationPreferences();
  }, []);

  const toggleNotifications = async (type) => {
    setIsToggling(true);
    try {
      const updatedNotifications = {
        ...notifications,
        [type]: !notifications[type],
      };
      const res = await fetch('/api/posts/toggle-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emailNotifications: updatedNotifications.email,
          webPushNotifications: updatedNotifications.webPush,
        }),
      });
      const data = await res.json();

      if (data.error) {
        showToast('Error', data.error, 'error');
        return;
      }

      setNotifications({
        email: data.notificationPreferences.email,
        webPush: data.notificationPreferences.webPush,
      });
      showToast(
        'Success',
        `${type === 'email' ? i18n.t('Email notifications') : i18n.t('Web push notifications')} ${
          data.notificationPreferences[type] ? i18n.t('enabled') : i18n.t('disabled')
        }`,
        'success'
      );
    } catch (error) {
      showToast('Error', error.message, 'error');
    } finally {
      setIsToggling(false);
    }
  };

  const freezeAccount = async () => {
    if (!window.confirm(i18n.t("Are you sure you want to freeze your account?"))) return;

    try {
      const res = await fetch('/api/users/freeze', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();

      if (data.error) {
        return showToast('Error', data.error, 'error');
      }
      if (data.success) {
        await logout();
        showToast('Success', i18n.t('Your account has been frozen'), 'success');
      }
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  };

  const handleLanguageChange = (lng) => {
    setLoading(true);
    i18n.changeLanguage(lng).then(() => {
      localStorage.setItem('language', lng);
      setLoading(false);
    });
  };

  const handleColorModeChange = () => {
    if (colorMode === 'light') {
      setColorMode('dark');
      setIsPinkMode(false);
      localStorage.setItem('pinkMode', 'false');
    } else {
      setColorMode('light');
      setIsPinkMode(true);
      localStorage.setItem('pinkMode', 'true');
    }
  };

  const handlePinkModeToggle = () => {
    const newValue = !isPinkMode;
    setIsPinkMode(newValue);
    localStorage.setItem('pinkMode', newValue ? 'true' : 'false');
    window.location.reload();
  };

  return (
    <VStack spacing={6} align="stretch" maxW="600px" mx="auto" p={4}>
      {/* Color Mode Section */}
      {canChangeColorMode && (
        <Box p={4} borderWidth="1px" borderRadius="lg" bg={useColorModeValue('pink.baby', 'gray.700')}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">{i18n.t('Pink Mode')}</Text>
              <Switch
                isChecked={isPinkMode}
                onChange={handlePinkModeToggle}
                colorScheme="pink"
                size="lg"
              />
            </HStack>
            <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.300')}>
              {isPinkMode
                ? 'Light mode is now pink! The header, widgets, and modals will use pink.'
                : 'Light/dark mode is normal. Toggle to enable pink mode.'}
            </Text>
          </VStack>
        </Box>
      )}

      {/* Notification Settings Section */}
      <Text my={4} fontWeight={'bold'}>
        {i18n.t('Notification Settings')}
      </Text>
      <VStack spacing={4} align="start">
        <HStack spacing={4}>
          <Switch
            isChecked={notifications.email}
            onChange={() => toggleNotifications('email')}
            isDisabled={isToggling}
            colorScheme="green"
          />
          <Text>
            {notifications.email
              ? i18n.t('Receive email notifications for new posts')
              : i18n.t('Email notifications are disabled')}
          </Text>
          {isToggling && <Spinner size="sm" />}
        </HStack>
        <HStack spacing={4}>
          <Switch
            isChecked={notifications.webPush}
            onChange={() => toggleNotifications('webPush')}
            isDisabled={isToggling}
            colorScheme="green"
          />
          <Text>
            {notifications.webPush
              ? i18n.t('Receive web push notifications for new posts')
              : i18n.t('Web push notifications are disabled')}
          </Text>
        </HStack>
      </VStack>

      {/* Language Section */}
      <Box p={4} borderWidth="1px" borderRadius="lg" bg={useColorModeValue('pink.baby', 'gray.700')}>
        <Text fontWeight="bold" mb={2}>
          {i18n.t('Language')}
        </Text>
        <Text mb={4}>
          {i18n.t('Choose your preferred language')}
        </Text>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <HStack spacing={4}>
            <Button
              onClick={() => handleLanguageChange('en')}
              _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }}
            >
              English
            </Button>
            <Button
              onClick={() => handleLanguageChange('zh')}
              _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }}
            >
              中文
            </Button>
          </HStack>
        )}
      </Box>

      {/* Account Section */}
      <Box p={4} borderWidth="1px" borderRadius="lg" bg={useColorModeValue('pink.baby', 'gray.700')}>
        <Text fontWeight="bold" mb={2}>
          {i18n.t('Account')}
        </Text>
        <Text mb={4}>
          {i18n.t('You can unfreeze your account anytime by logging in.')}
        </Text>
        <Button
          size="sm"
          colorScheme="red"
          onClick={freezeAccount}
          _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' }}
        >
          {i18n.t('Freeze Account')}
        </Button>
      </Box>
    </VStack>
  );
};