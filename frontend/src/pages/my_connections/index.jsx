// import React from 'react'
// import UserLayout from '@/layout/UserLayout'
// import DashboardLayout from '@/layout/DashboardLayout'
// import { useDispatch, useSelector } from "react-redux";
// import {
//   AcceptConnection,
//   getMyConnectionRequests,
// } from "@/config/redux/action/authAction";
// import styles from "./index.module.css";
// import { BASE_URL } from "@/config";
// import { useRouter } from "next/router";
// import { useEffect } from 'react';

// function MyConnectionsPage() {

//   const dispatch = useDispatch();
//   const authState = useSelector((state) => state.auth)
//   const connectionRequests = Array.isArray(
//     authState.connectionRequest
//   )
//     ? authState.connectionRequest
//     : [];

//   useEffect(() => {
//     dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
//   }, []);

//   const router = useRouter();

//   useEffect(() => {
//     if (authState.connectionRequest.length != 0) {
//       console.log(authState.connectionRequest);
//     }
//   }, [authState.connectionRequest]);

//   return (
//     <UserLayout>
//       <DashboardLayout>
//         <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
//           <h4>My Connections</h4>
//           {authState.connectionRequest.length === 0 && (
//             <h1>No Connection Request Pending</h1>
//           )}

//           {authState.connectionRequest.length != 0 &&
//             authState.connectionRequest
//               .filter((connection) => connection.status_accepted === null)
//               .map((user, index) => {
//                 return (
//                   <div
//                     onClick={() => {
//                       router.push(`/view_profile/${user.userId.username}`);
//                     }}
//                     className={styles.userCard}
//                     key={index}
//                   >
//                     <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}>
//                       <div className={styles.profilePicture}>
//                         <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
//                       </div>
//                       <div className={styles.userInfo}>
//                         <h3>{user.userId.name}</h3>
//                         <p>{user.userId.username}</p>
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           dispatch(
//                             AcceptConnection({
//                               connectionId: user._id,
//                               token: localStorage.getItem("token"),
//                               action: "accept",
//                             })
//                           );
//                         }}
//                         className={styles.connectedButton}
//                       >
//                         Accept
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}

//           <h4>My Network</h4>

//           {authState.connectionRequest
//             .filter((connection) => connection.status_accepted !== null)
//             .map((user, index) => {
//               return (
//                 <div
//                   onClick={() => {
//                     router.push(`/view_profile/${user.userId.username}`);
//                   }}
//                   className={styles.userCard}
//                   key={index}
//                 >
//                   <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}>
//                     <div className={styles.profilePicture}>
//                       <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
//                     </div>
//                     <div className={styles.userInfo}>
//                       <h3>{user.userId.name}</h3>
//                       <p>{user.userId.username}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//         </div>
//       </DashboardLayout>
//     </UserLayout>
//   )
// }

// export default MyConnectionsPage














import React, { useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  AcceptConnection,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  // Always ensure connectionRequests is an array.
  const connectionRequests = Array.isArray(authState.connectionRequest)
    ? authState.connectionRequest
    : [];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getMyConnectionRequests({ token }));
    }
  }, [dispatch]);

  const pendingRequests = connectionRequests.filter(
    (connection) => connection.status_accepted === null
  );

  const acceptedConnections = connectionRequests.filter(
    (connection) => connection.status_accepted === true
  );

  const handleAccept = (e, requestId) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(
      AcceptConnection({
        connectionId: requestId,
        token,
        action: "accept",
      })
    );
  };

  const renderUserCard = (user, showAcceptButton = false) => {
    const profile = user?.userId;

    // Avoid rendering incomplete or unpopulated connection records.
    if (!profile) return null;

    return (
      <div
        key={user._id}
        onClick={() => {
          if (profile.username) {
            router.push(`/view_profile/${profile.username}`);
          }
        }}
        className={styles.userCard}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            justifyContent: "space-between",
          }}
        >
          <div className={styles.profilePicture}>
            <img
              src={`${BASE_URL}/${profile.profilePicture || "default.jpg"}`}
              alt={`${profile.name || "User"}'s profile`}
            />
          </div>

          <div className={styles.userInfo}>
            <h3>{profile.name || "Unknown user"}</h3>
            <p>{profile.username || ""}</p>
          </div>

          {showAcceptButton && (
            <button
              type="button"
              onClick={(e) => handleAccept(e, user._id)}
              className={styles.connectedButton}
            >
              Accept
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.7rem",
          }}
        >
          <h4>My Connections</h4>

          {pendingRequests.length === 0 ? (
            <h3>No Connection Requests Pending</h3>
          ) : (
            pendingRequests.map((user) => renderUserCard(user, true))
          )}

          <h4>My Network</h4>

          {acceptedConnections.length === 0 ? (
            <p>You don't have any accepted connections yet.</p>
          ) : (
            acceptedConnections.map((user) => renderUserCard(user))
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnectionsPage;
