// feature disabled due to automatic folow, export function has been commented 
// import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";

// const SuggestedUser = ({ user }) => {
// 	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

// 	return (
// 		<Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
// 			{/* left side */}
// 			<Flex gap={2} as={Link} to={`${user.username}`}>
// 				<Avatar src={user.profilePic} />
// 				<Box>
// 					<Text fontSize={"sm"} fontWeight={"bold"}>
// 						{user.username}
// 					</Text>
// 					<Text color={"gray.light"} fontSize={"sm"}>
// 						{user.name}
// 					</Text>
// 				</Box>
// 			</Flex>
// 			{/* right side */}
// 			<Button
// 				size={"sm"}
// 				color={following ? "black" : "white"}
// 				bg={following ? "white" : "blue.400"}
// 				onClick={handleFollowUnfollow}
// 				isLoading={updating}
// 				_hover={{
// 					color: following ? "black" : "white",
// 					opacity: ".8",
// 				}}
// 			>
// 				{following ? "Unfollow" : "Follow"}
// 			</Button>
// 		</Flex>
// 	);
// };

// export default SuggestedUser;

//  SuggestedUser component, if u want to copy and paste as shown in the tutorial

{
	/* <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex> */
}

import React, { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const SuggestedUser = ({ user }) => {
	const [isFollowing, setIsFollowing] = useState(false);
	const showToast = useShowToast();

	const handleFollow = async () => {
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "PUT",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setIsFollowing(true);
			showToast("Success", "User followed successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<div className="suggested-user">
			<img src={user.profilePic || "/default-avatar.png"} alt={user.username} className="avatar" />
			<div className="user-info">
				<span className="username">{user.username}</span>
				<button onClick={handleFollow} className="follow-button" disabled={isFollowing}>
					{isFollowing ? "Following" : "Follow"}
				</button>
			</div>
		</div>
	);
};

export default SuggestedUser;
