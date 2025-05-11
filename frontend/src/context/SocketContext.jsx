import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (!user?._id) return;

		const socket = io("https://pear-tsk2.onrender.com/", {
			query: {
				userId: user._id,
			},
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			timeout: 60000,
			withCredentials: true
		});

		socket.on("connect", () => {
			console.log("Socket connected");
		});

		socket.on("connect_error", (error) => {
			console.error("Socket connection error:", error);
		});

		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		setSocket(socket);

		return () => {
			if (socket) {
				socket.off("connect");
				socket.off("connect_error");
				socket.off("getOnlineUsers");
				socket.close();
			}
		};
	}, [user?._id]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
