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
	const [isConnected, setIsConnected] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (!user?._id) return;

		const connectSocket = () => {
			const socket = io("https://pear-tsk2.onrender.com/", {
				query: {
					userId: user._id,
				},
				transports: ['websocket', 'polling'],
				reconnection: true,
				reconnectionAttempts: 10,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				timeout: 60000,
				withCredentials: true
			});

			socket.on("connect", () => {
				console.log("Socket connected");
				setIsConnected(true);
				setRetryCount(0);
			});

			socket.on("connect_error", (error) => {
				console.error("Socket connection error:", error);
				setIsConnected(false);
				setRetryCount(prev => prev + 1);
				
				// If we've retried too many times, wait longer before next attempt
				if (retryCount >= 5) {
					setTimeout(() => {
						setRetryCount(0);
						socket.connect();
					}, 30000); // Wait 30 seconds before trying again
				}
			});

			socket.on("disconnect", (reason) => {
				console.log("Socket disconnected:", reason);
				setIsConnected(false);
				
				// If the server closed the connection, try to reconnect
				if (reason === "io server disconnect") {
					socket.connect();
				}
			});

			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			setSocket(socket);

			return socket;
		};

		const socket = connectSocket();

		return () => {
			if (socket) {
				socket.off("connect");
				socket.off("connect_error");
				socket.off("disconnect");
				socket.off("getOnlineUsers");
				socket.close();
			}
		};
	}, [user?._id, retryCount]);

	return (
		<SocketContext.Provider value={{ 
			socket, 
			onlineUsers, 
			isConnected,
			retryCount 
		}}>
			{children}
		</SocketContext.Provider>
	);
};
