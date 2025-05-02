import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const PostPage = () => {
	const { postId } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPost = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/posts/${postId}`);
				const data = await res.json();
				setPost(data);
			} catch (e) {
				setPost(null);
			} finally {
				setLoading(false);
			}
		};
		fetchPost();
	}, [postId]);

	if (loading) {
		return (
			<div className="friendkit-loading-wrapper">
				<div className="friendkit-loader"></div>
				<div className="loading-text">Loading post...</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="empty-state">
				<div className="empty-state-icon">
					<i data-feather="file-text"></i>
				</div>
				<div className="empty-state-content">
					<h3>Post not found</h3>
				</div>
			</div>
		);
	}

	return (
		<div className="navbar-v2-wrapper">
			<div className="container is-custom">
				<div className="columns is-centered">
					<div className="column is-8">
						<div className="card is-post">
							<div className="card-heading">
								<div className="user-block">
									<img src={post.author?.profilePic || "/default-avatar.png"} alt={post.author?.username} />
									<div style={{ marginLeft: 12 }}>
										<a>{post.author?.username}</a>
										<div className="time">{new Date(post.createdAt).toLocaleDateString()}</div>
									</div>
								</div>
							</div>
							<div className="card-body content-wrap">
								<div className="post-text">
									<p>{post.text}</p>
								</div>
								{post.images?.length > 0 && (
									<div className="post-image">
										{post.images.map((img, idx) => (
											<img key={idx} src={img} alt="" />
										))}
									</div>
								)}
							</div>
							<div className="card-footer">
								<div className="buttons">
									<button className="button is-solid grey-button is-sm">
										<i data-feather="heart"></i>
										<span>{post.likes?.length || 0}</span>
									</button>
									<button className="button is-solid grey-button is-sm">
										<i data-feather="message-circle"></i>
										<span>{post.comments?.length || 0}</span>
									</button>
									<button className="button is-solid grey-button is-sm">
										<i data-feather="share-2"></i>
										<span>Share</span>
									</button>
								</div>
							</div>
						</div>
						{/* Comments section */}
						<div className="card">
							<div className="card-heading">
								<h4>Comments</h4>
							</div>
							<div className="card-body">
								{post.comments?.length === 0 ? (
									<span>No comments yet.</span>
								) : (
									post.comments.map((comment) => (
										<div key={comment._id} className="media">
											<div className="media-left">
												<img src={comment.author?.profilePic || "/default-avatar.png"} alt={comment.author?.username} style={{ width: 32, height: 32, borderRadius: "50%" }} />
											</div>
											<div className="media-content">
												<span>{comment.author?.username}</span>
												<span style={{ marginLeft: 8, color: '#b5b5c3', fontSize: '0.85em' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
												<div>{comment.text}</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostPage;