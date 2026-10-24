import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createPost, deletePost, getAllComments, getAllPosts, incrementPostLike, postComment } from "@/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [isArticleMode, setIsArticleMode] = useState(false);
  const postInputRef = useRef(null);

  const handleWriteArticle = () => {
    setIsArticleMode(true);
    setTimeout(() => {
      postInputRef.current?.focus();
      postInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };



  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        .unwrap()
        .catch(() => {
          localStorage.removeItem("token");
          router.push("/login");
        });
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);



  const handleUpload = async () => {
    if (!postContent.trim() && !fileContent) return;
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent(null);
    setIsArticleMode(false);
    dispatch(getAllPosts());
  };

  const handleCommentToggle = (postId) => {
    if (openCommentPostId === postId) {
      setOpenCommentPostId(null);
    } else {
      dispatch(getAllComments({ post_id: postId }));
      setOpenCommentPostId(postId);
    }
  };

  const handleRepost = (post) => {
    const text = encodeURIComponent(post.body);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleSend = (post) => {
    if (navigator.share) {
      navigator.share({ title: "ProConnect Post", text: post.body });
    } else {
      navigator.clipboard.writeText(post.body);
      alert("Post text copied to clipboard!");
    }
  };

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Loading feed...</div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>

          {/* CREATE POST - LinkedIn style */}
          <div className={styles.createPostCard}>
            <div className={styles.createPostTop}>
              <img src={`${BASE_URL}/${authState.user.userId?.profilePicture}`} alt="avatar" />
              <textarea
                ref={postInputRef}
                className={styles.createPostInput}
                placeholder={isArticleMode ? "Write your article here..." : "Start a post"}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={postContent.length > 0 || isArticleMode ? 4 : 1}
              />
            </div>

            {fileContent && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".3rem .6rem", marginBottom: ".5rem", background: "#f3f2ef", borderRadius: "6px", fontSize: ".8rem", color: "#555" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                  Attached: <strong>{fileContent.name}</strong>
                </span>
                <button 
                  type="button"
                  onClick={() => setFileContent(null)}
                  style={{ background: "none", border: "none", color: "#cc0000", cursor: "pointer", fontWeight: "bold", fontSize: ".9rem" }}
                  title="Remove attachment"
                >
                  ✕
                </button>
              </div>
            )}

            {(postContent.trim().length > 0 || fileContent || isArticleMode) && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem", paddingBottom: ".4rem" }}>
                {isArticleMode && (
                  <button 
                    type="button"
                    onClick={() => { setIsArticleMode(false); }} 
                    style={{ padding: ".4rem 1rem", background: "transparent", color: "#666", border: "1px solid #ccc", borderRadius: "20px", fontSize: ".85rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                )}
                <button onClick={handleUpload} style={{ padding: ".4rem 1.2rem", background: "#0a66c2", color: "white", border: "none", borderRadius: "20px", fontSize: ".85rem", fontWeight: 600, cursor: "pointer" }}>Post</button>
              </div>
            )}

            <div className={styles.createPostDivider}></div>

            <div className={styles.createPostActions}>
              {/* Video */}
              <label htmlFor="videoUpload" className={styles.createPostBtn} style={{ cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5f9b41" width="20" height="20">
                  <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V15l5.25 3.75V8.25L18.75 12V8.25a3 3 0 0 0-3-3H2.25Z" clipRule="evenodd" />
                </svg>
                Video
              </label>
              <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="videoUpload" accept="video/*" />

              {/* Photo */}
              <label htmlFor="fileUpload" className={styles.createPostBtn} style={{ cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#378fe9" width="20" height="20">
                  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-2.5 2.5-1.4-1.4a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                </svg>
                Photo
              </label>
              <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="fileUpload" accept="image/*" />

              {/* Write article */}
              <button 
                type="button"
                className={styles.createPostBtn}
                onClick={handleWriteArticle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e06847" width="20" height="20">
                  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
                Write article
              </button>
            </div>
          </div>

          {/* SORT BAR */}
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>
              Sort by: Top
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>

          {/* POSTS FEED */}

          {postState.posts.filter((post) => post.userId).map((post) => (
            <div key={post._id} className={styles.postCard}>

              {/* Header */}
              <div className={styles.postCard__header}>
                <div className={styles.postCard__headerLeft}>
                  <img
                    className={styles.postCard__avatar}
                    src={`${BASE_URL}/${post.userId.profilePicture}`}
                    alt=""
                    onClick={() => router.push(`/view_profile/${post.userId.username}`)}
                  />
                  <div>
                    <p className={styles.postCard__name} onClick={() => router.push(`/view_profile/${post.userId.username}`)}>
                      {post.userId.name}
                    </p>
                    <p className={styles.postCard__meta}>@{post.userId.username}</p>
                  </div>
                </div>
                { post.userId._id === authState.user.userId?._id && (
                  <button className={styles.deleteBtn} onClick={async () => {
                    await dispatch(deletePost({ post_id: post._id }));
                    dispatch(getAllPosts());
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Body */}
              <div className={styles.postCard__body}>
                <p>{post.body}</p>
              </div>

              {/* Media */}
              {post.media && post.media !== "" && (
                <div className={styles.postCard__image}>
                  <img src={`${BASE_URL}/${post.media}`} alt="post media" />
                </div>
              )}

              {/* Stats */}
              <div className={styles.postCard__stats}>
                <span>{post.likes} likes</span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCommentToggle(post._id)}
                >
                  {openCommentPostId === post._id
                    ? postState.comments.length
                    : ""} comments
                </span>
              </div>

              {/* Actions */}
              <div className={styles.postCard__actions}>
                <button
                  className={`${styles.actionBtn} ${post.likes > 0 ? styles.liked : ""}`}
                  onClick={async () => {
                    await dispatch(incrementPostLike({ post_id: post._id }));
                    dispatch(getAllPosts());
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                  </svg>
                  Like
                </button>

                <button className={styles.actionBtn} onClick={() => handleCommentToggle(post._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                  </svg>
                  Comment
                </button>

                <button className={styles.actionBtn} onClick={() => handleRepost(post)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                  </svg>
                  Repost
                </button>

                <button className={styles.actionBtn} onClick={() => handleSend(post)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                  Send
                </button>
              </div>

              {/* Comments Section */}
              {openCommentPostId === post._id && (
                <div className={styles.commentsSection}>
                 {postState.comments.filter((c) => c.userId).map((c) => (
                    <div key={c._id} className={styles.commentItem}>
                      <img src={`${BASE_URL}/${c.userId.profilePicture}`} alt="" />
                      <div className={styles.commentBubble}>
                        <strong>{c.userId.name}</strong>
                        <p>{c.body}</p>
                      </div>
                    </div>
                  ))}
                  <div className={styles.commentInputRow}>
                    <img src={`${BASE_URL}/${authState.user.userId?.profilePicture}`} alt="" />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && commentText.trim()) {
                          await dispatch(postComment({ post_id: post._id, body: commentText }));
                          setCommentText("");
                          dispatch(getAllComments({ post_id: post._id }));
                        }
                      }}
                    />
                    <button
                      className={styles.commentSubmitBtn}
                      onClick={async () => {
                        if (!commentText.trim()) return;
                        await dispatch(postComment({ post_id: post._id, body: commentText }));
                        setCommentText("");
                        dispatch(getAllComments({ post_id: post._id }));
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}

        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Dashboard;