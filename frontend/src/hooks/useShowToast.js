import { useContext, useCallback } from "react";
import { NotificationContext } from "../providers/NotificationProvider";

const useShowToast = () => {
	return (title, description, status) => {
		if (status === 'error') {
			toasts.service.error(title, 'alert-circle', description, 'topRight', 5000);
		} else if (status === 'success') {
			toasts.service.success(title, 'check-circle', description, 'topRight', 5000);
		} else {
			toasts.service.info(title, 'info', description, 'topRight', 5000);
		}
	};
};

export default useShowToast;
