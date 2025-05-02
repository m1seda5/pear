import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};
	return (
		<div>
			<button
				className="button is-danger is-light is-large"
				onClick={handleLogout}
				style={{ borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}
				title="Logout"
			>
				<FiLogOut size={28} />
			</button>
		</div>
	);
};

export default LogoutButton;
