import { useContext, useCallback } from "react";
import { NotificationContext } from "../providers/NotificationProvider";

const useShowToast = () => {
	const { showNotification } = useContext(NotificationContext);
	// Usage: showToast(title, description, status)
	return useCallback(
		(title, description, status) => {
			showNotification({ title, description, status });
		},
		[showNotification]
	);
};

export default useShowToast;
