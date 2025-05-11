import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
	const ctx = useContext(SocketContext);
	return ctx || { socket: null, onlineUsers: [] };
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (!user || !user._id) {
			setSocket(null);
			setOnlineUsers([]);
			return;
		}
		const socket = io("https://pear-tsk2.onrender.com/", {
			query: {
				userId: user._id,
			},
		});
		setSocket(socket);
		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});
		return () => socket && socket.close();
	}, [user?._id]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
