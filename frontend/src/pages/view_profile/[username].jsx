// import { BASE_URL, clientServer } from '@/config';
// import React, { useEffect, useState } from 'react'
// import UserLayout from '@/layout/UserLayout';
// import DashboardLayout from '@/layout/DashboardLayout';
// import styles from "./index.module.css";
// import { useRouter } from 'next/router';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllPosts } from '@/config/redux/action/postAction';
// import { getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';

// function ViewProfilePage({userProfile}) {

//   const router=useRouter();
//   const postReducer=useSelector((state)=>state.postReducer);
//   const dispatch=useDispatch();

//   const authState=useSelector((state)=>state.auth);
//   const [userPosts, setUserPosts] = useState([]);
//   const [isCurrentUserInConnection, setIsCurrentUserInConnection] =useState(false);
//   const [isConnectionNull, setIsConnectionNull] = useState(true);

//   const getUsersPost = async () => {
//     dispatch(getAllPosts());
//     dispatch(
//       getConnectionsRequest({ token: localStorage.getItem("token") })
//     );
//     dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
//   };

//   useEffect(() => {
//     let post = postReducer.posts.filter((post) => {
//       return post.userId.username === router.query.username;
//     });
//     setUserPosts(post);
//   }, [postReducer.posts]);


//    useEffect(() => {
//     console.log(authState.connections, userProfile.userId._id);
//     if (
//       authState.connections.some(
//         (user) => user.connectionId._id === userProfile.userId._id
//       )
//     ) {
//       setIsCurrentUserInConnection(true);
//       if (
//         authState.connections.find(
//           (user) => user.connectionId._id === userProfile.userId._id
//         ).status_accepted === true
//       ) {
//         setIsConnectionNull(false);
//       }
//     }

//      if (
//       authState.connectionRequest.some(
//         (user) => user.userId._id === userProfile.userId._id
//       )
//     ) {
//       setIsCurrentUserInConnection(true);
//       if (
//         authState.connectionRequest.find(
//           (user) => user.userId._id === userProfile.userId._id
//         ).status_accepted === true
//       ) {
//         setIsConnectionNull(false);
//       }
//     }
//   }, [authState.connections , authState.connectionRequest]);

//   useEffect(() => {
//     getUsersPost();
//   }, []);

    
    
//   return (
//     <UserLayout>
//       <DashboardLayout>
//         <div className={styles.container}>
//           <div className={styles.backDropContainer}>
//             <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop"></img>
//           </div>

//           <div className={styles.profileContainer__details}>
//             <div className={styles.profileContainer__flex}>

//               <div style={{flex:"0.8"}}>
//                 <div style={{display:"flex",width:"fit-content",alignItems:"center"}}>
//                   <h2>{userProfile.userId.username}</h2>
//                   <p style={{ color: "grey" }}>
//                     @{userProfile.userId.username}
//                   </p>
//                 </div>
                
//                 <div style={{display: "flex",alignItems: "center",gap: "1.2rem"}}>
//                   {isCurrentUserInConnection?
//                     <button className={styles.connectedButton}>{isConnectionNull?"Pending":"Connected"}</button>
//                     :
//                     <button onClick={() => {
//                         dispatch(sendConnectionRequest({token: localStorage.getItem("token"),user_id: userProfile.userId._id,}));
//                       }}
//                       className={styles.connectBtn}>Connect</button>
//                   }

//                   <div onClick={ async () => {
//                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
//                    window.open(`${BASE_URL}/${response.data.message}`, "_blank")
//                   }} style={{ cursor: "pointer" }}>
//                     <svg
//                       style={{ width: "1.2em" }}
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="size-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
//                       />
//                     </svg>
//                   </div>
//                 </div>

//                 <div>
//                   <p>{userProfile.bio}</p>
//                 </div>

//               </div>

//               <div style={{flex:"0.2"}}>
//                 <h2>Recent Activity</h2>
//                 {userPosts.map((post) => {
//                    return (
//                     <div key={post._id} className={styles.postCard}>
//                       <div className={styles.card}>
//                         <div className={styles.card_profileContainer}>
//                           {post.media !== "" ? (
//                             <img src={`${BASE_URL}/${post.media}`} alt="" />
//                           ) : (
//                             <div
//                               style={{ width: "3.4rem", height: "3.4rem" }}
//                             ></div>
//                           )}
//                         </div>
//                         <p>{post.body}</p>
//                       </div>
//                     </div>
//                    )
//                 })}
//               </div>

//             </div>
//           </div>

//           <div className="workHistory">
//             <h4>Work History</h4>

//             <div className={styles.workHistoryContainer}>
//               {userProfile.pastWork.map((work, index) => {
//                 return (
//                   <div key={index} className={styles.workHistoryCard}>
//                     <p
//                       style={{
//                         fontWeight: "bold",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "0.8rem",
//                       }}
//                     >
//                       {work.company} - {work.position}
//                     </p>
//                     <p>{work.years}</p>
//                   </div>
//                 );
//               })}

//             </div>
//           </div>
//         </div>
//       </DashboardLayout>
//     </UserLayout>
//   )
// }

// export default ViewProfilePage

// export async function getServerSideProps(context) {

//   console.log("From View");
//   console.log(context.query.username);

//   const request = await clientServer.get(
//     "/user/get_profile_based_on_username",
//     {
//       params: {
//         username: context.query.username,
//       },
//     }
//   );
//   const response = await request.data;
//   console.log(response);
//   return{ props:{userProfile:request.data.profile} }
// }











































import React, { useEffect, useState } from "react";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  // Always keep Redux data safe for array operations.
  const connections = Array.isArray(authState.connections)
    ? authState.connections
    : [];

  const connectionRequests = Array.isArray(authState.connectionRequest)
    ? authState.connectionRequest
    : [];

  const posts = Array.isArray(postReducer.posts)
    ? postReducer.posts
    : [];

  const profileUser = userProfile?.userId;
  const profileUserId = profileUser?._id;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load posts and connection information.
  useEffect(() => {
    dispatch(getAllPosts());

    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      dispatch(getConnectionsRequest({ token: savedToken }));
      dispatch(getMyConnectionRequests({ token: savedToken }));
    }
  }, [dispatch]);

  // Find posts belonging to this profile.
  useEffect(() => {
    if (!router.query.username) {
      setUserPosts([]);
      return;
    }

    const filteredPosts = posts.filter(
      (post) =>
        post.userId?.username === router.query.username
    );

    setUserPosts(filteredPosts);
  }, [posts, router.query.username]);

  // Determine whether the current user has a connection/request with this user.
  useEffect(() => {
    if (!profileUserId) {
      setIsCurrentUserInConnection(false);
      setIsConnectionNull(true);
      return;
    }

    const sentRequest = connections.find(
      (item) =>
        String(item.connectionId?._id ?? item.connectionId) ===
        String(profileUserId)
    );

    const receivedRequest = connectionRequests.find(
      (item) =>
        String(item.userId?._id ?? item.userId) ===
        String(profileUserId)
    );

    const matchingRequest = sentRequest || receivedRequest;

    setIsCurrentUserInConnection(Boolean(matchingRequest));

    setIsConnectionNull(
      !matchingRequest || matchingRequest.status_accepted !== true
    );
  }, [profileUserId, connections, connectionRequests]);

  // Send a connection request.
  const handleConnect = () => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (!profileUserId) return;

    dispatch(
      sendConnectionRequest({
        token,
        user_id: profileUserId,
      })
    );
  };

  // Open the backend resume-download endpoint.
  const handleDownloadResume = () => {
    if (!profileUserId) return;

    const resumeUrl =
      `${BASE_URL}/download_resume?id=${encodeURIComponent(profileUserId)}`;

    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  if (!userProfile || !profileUser) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.container}>
            <h2>Profile not found.</h2>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          {/* Profile picture */}
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${profileUser.profilePicture || "default.jpg"}`}
              alt={`${profileUser.username || "User"} profile`}
            />
          </div>

          {/* Profile details */}
          <div className={styles.profileContainer__details}>
            <div className={styles.profileContainer__flex}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  <h2>{profileUser.name || profileUser.username}</h2>
                  <p style={{ color: "grey" }}>
                    @{profileUser.username}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    flexWrap: "wrap",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button
                      type="button"
                      className={styles.connectedButton}
                      disabled
                    >
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConnect}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}

                  {/* Resume download */}
                  <div
                    onClick={handleDownloadResume}
                    style={{ cursor: "pointer" }}
                    title="Download resume"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        handleDownloadResume();
                      }
                    }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p>{userProfile.bio || ""}</p>
                </div>
              </div>

              {/* Recent activity */}
              <div style={{ flex: "0.2" }}>
                <h2>Recent Activity</h2>

                {userPosts.length === 0 ? (
                  <p>No recent posts.</p>
                ) : (
                  userPosts.map((post) => (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media ? (
                            <img
                              src={`${BASE_URL}/${post.media}`}
                              alt="Post media"
                            />
                          ) : (
                            <div
                              style={{
                                width: "3.4rem",
                                height: "3.4rem",
                              }}
                            />
                          )}
                        </div>

                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Work history */}
          <div className="workHistory">
            <h4>Work History</h4>

            <div className={styles.workHistoryContainer}>
              {(userProfile.pastWork ?? []).map((work, index) => (
                <div
                  key={
                    work._id ||
                    `${work.company || "company"}-${work.position || "position"}-${index}`
                  }
                  className={styles.workHistoryCard}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    {work.company} - {work.position}
                  </p>

                  <p>{work.years}</p>
                </div>
              ))}

              {(!userProfile.pastWork ||
                userProfile.pastWork.length === 0) && (
                <p>No work history added.</p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default ViewProfilePage;

// Fetch profile data on the server.
export async function getServerSideProps(context) {
  try {
    const { username } = context.params || {};

    if (!username) {
      return { notFound: true };
    }

    const response = await clientServer.get(
      "/user/get_profile_based_on_username",
      {
        params: { username },
      }
    );

    const userProfile = response.data?.profile;

    if (!userProfile?.userId) {
      return { notFound: true };
    }

    return {
      props: {
        userProfile: JSON.parse(JSON.stringify(userProfile)),
      },
    };
  } catch (error) {
    console.error(
      "Failed to load profile:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return { notFound: true };
    }

    // Surface unexpected server/API errors rather than hiding them.
    throw error;
  }
}
