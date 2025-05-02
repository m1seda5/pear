import { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from 'react-router-dom';
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useTranslation } from 'react-i18next';

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);
	const navigate = useNavigate();
	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);

	useEffect(() => {
		const handleLanguageChange = (lng) => {
			setLanguage(lng);
		};
		i18n.on('languageChanged', handleLanguageChange);
		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [i18n]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return;
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json();
			if (data.error) {
				showToast(t("Error"), data.error, "error");
				return;
			}
			showToast(t("Success"), t("Profile updated successfully"), "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			showToast(t("Error"), error.message, "error");
		} finally {
			setUpdating(false);
		}
	};

	const handleCancel = () => {
		navigate(`/${user.username}`);
	};

	return (
		<div className="view-wrapper">
			<div className="container">
				<div className="profile-edit-page">
					<form onSubmit={handleSubmit} className="card profile-edit-card">
						<div className="card-heading">
							<h4>{t("Edit Profile")}</h4>
							<button type="button" className="button is-light is-small" style={{ float: 'right' }} onClick={handleCancel}>
								{t("Cancel")}
							</button>
						</div>
						<div className="card-body">
							<div className="profile-edit-avatar-block">
								<div className="profile-edit-avatar" onClick={() => fileRef.current.click()} style={{ cursor: 'pointer' }}>
									<img src={imgUrl || user.profilePic || "/default-avatar.png"} alt={user.name} />
									<span className="edit-avatar-overlay">{t("Change Avatar")}</span>
								</div>
								<input type="file" hidden ref={fileRef} onChange={handleImageChange} />
							</div>
							<div className="field">
								<label className="label">{t("Full name")}</label>
								<div className="control">
									<input
										className="input"
										type="text"
										placeholder={t("John Doe")}
										value={inputs.name}
										onChange={e => setInputs({ ...inputs, name: e.target.value })}
									/>
								</div>
							</div>
							<div className="field">
								<label className="label">{t("User name")}</label>
								<div className="control">
									<input
										className="input"
										type="text"
										placeholder={t("johndoe")}
										value={inputs.username}
										onChange={e => setInputs({ ...inputs, username: e.target.value })}
									/>
								</div>
							</div>
							<div className="field">
								<label className="label">{t("Email address")}</label>
								<div className="control">
									<input
										className="input"
										type="email"
										placeholder={t("your-email@example.com")}
										value={inputs.email}
										onChange={e => setInputs({ ...inputs, email: e.target.value })}
									/>
								</div>
							</div>
							<div className="field">
								<label className="label">{t("Bio")}</label>
								<div className="control">
									<input
										className="input"
										type="text"
										placeholder={t("Your bio.")}
										value={inputs.bio}
										onChange={e => setInputs({ ...inputs, bio: e.target.value })}
									/>
								</div>
							</div>
							<div className="field">
								<label className="label">{t("Password")}</label>
								<div className="control">
									<input
										className="input"
										type="password"
										placeholder={t("password")}
										value={inputs.password}
										onChange={e => setInputs({ ...inputs, password: e.target.value })}
									/>
								</div>
							</div>
							<div className="field is-grouped is-grouped-right">
								<div className="control">
									<button
										type="submit"
										className={`button is-solid primary-button${updating ? ' is-loading' : ''}`}
										disabled={updating}
									>
										{t("Save Changes")}
									</button>
								</div>
								<div className="control">
									<button
										type="button"
										className="button is-light"
										onClick={handleCancel}
									>
										{t("Cancel")}
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
