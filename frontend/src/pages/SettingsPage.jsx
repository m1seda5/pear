import React from 'react';
import useShowToast from '../hooks/useShowToast';
import useLogout from '../hooks/useLogout';
import i18n from '../i18n';

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();
	const [loading, setLoading] = React.useState(false);
	const [notifications, setNotifications] = React.useState({
		email: true,
		webPush: true,
	});
	const [isToggling, setIsToggling] = React.useState(false);

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
					email: data.emailNotifications !== undefined ? data.emailNotifications : true,
					webPush: data.webPushNotifications !== undefined ? data.webPushNotifications : true,
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

	return (
		<div className="view-wrapper">
			<div className="container">
				<div className="settings-page">
					<div className="card settings-card">
						<div className="card-heading">
							<h4>{i18n.t('Settings')}</h4>
						</div>
						<div className="card-body">
							{/* Notification Settings Section */}
							<div className="settings-section">
								<h5 className="settings-title">{i18n.t('Notification Settings')}</h5>
								<div className="settings-toggle-row">
									<label className="switch">
										<input
											type="checkbox"
											checked={notifications.email}
											onChange={() => toggleNotifications('email')}
											disabled={isToggling}
										/>
										<span className="slider round"></span>
									</label>
									<span className="settings-label">
										{notifications.email
											? i18n.t('Receive email notifications for new posts')
											: i18n.t('Email notifications are disabled')}
									</span>
									{isToggling && <span className="settings-spinner"></span>}
								</div>
								<div className="settings-toggle-row">
									<label className="switch">
										<input
											type="checkbox"
											checked={notifications.webPush}
											onChange={() => toggleNotifications('webPush')}
											disabled={isToggling}
										/>
										<span className="slider round"></span>
									</label>
									<span className="settings-label">
										{notifications.webPush
											? i18n.t('Receive web push notifications for new posts')
											: i18n.t('Web push notifications are disabled')}
									</span>
								</div>
							</div>
							{/* Account Freeze Section */}
							<div className="settings-section">
								<h5 className="settings-title">{i18n.t('Freeze Your Account')}</h5>
								<p className="settings-description">{i18n.t('You can unfreeze your account anytime by logging in.')}</p>
								<button className="button is-danger is-small" onClick={freezeAccount} disabled={isToggling}>
									{i18n.t('Freeze')}
								</button>
							</div>
							{/* Language Selection Section */}
							<div className="settings-section">
								<h5 className="settings-title">{i18n.t('Language')}</h5>
								{loading ? (
									<span className="settings-spinner"></span>
								) : (
									<div className="settings-lang-buttons">
										<button className="button is-light is-small" onClick={() => handleLanguageChange('en')}>
											English
										</button>
										<button className="button is-light is-small" onClick={() => handleLanguageChange('zh')}>
											中文
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};