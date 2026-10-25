import React, { useEffect } from 'react';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getAboutUser } from '@/config/redux/action/authAction';
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

function Discoverpage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
    if (!authState.user && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(getAboutUser({ token }));
      }
    }
  }, [dispatch, authState.all_profiles_fetched, authState.user]);

  const currentUserId = authState.user?.userId?._id;
  const currentUsername = authState.user?.userId?.username;

  const otherUsers = authState.all_profiles_fetched
    ? authState.all_users.filter((user) => {
        if (!user?.userId) return false;
        if (currentUserId && user.userId._id === currentUserId) return false;
        if (currentUsername && user.userId.username === currentUsername) return false;
        return true;
      })
    : [];

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>

          <div className={styles.allUserProfile}>
            {otherUsers.map((user) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  key={user._id}
                  className={styles.userCard}
                >
                  <img
                    className={styles.userCard_image}
                    src={`${BASE_URL}/${user.userId.profilePicture}`}
                    alt="profile"
                  />
                  <div>
                    <h1>{user.userId.name}</h1>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Discoverpage;
