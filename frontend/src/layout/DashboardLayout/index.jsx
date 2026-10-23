import React from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setTokenIsThere, setTokenIsNotThere } from "@/config/redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/config";

function DashboardLayout({ children }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setTokenIsNotThere());
      router.push("/login");
    } else {
      dispatch(setTokenIsThere());
    }
  }, [dispatch, router]);

  const user = authState.user;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.layout}>

        {/* LEFT SIDEBAR */}
        <aside className={styles.leftSidebar}>
          {user && (
            <div className={styles.profileCard}>
              <div className={styles.profileCard__banner}></div>
              <div className={styles.profileCard__avatar}>
                <img src={`${BASE_URL}/${user.userId?.profilePicture}`} alt="avatar" />
              </div>
              <div className={styles.profileCard__info}>
                <h3 onClick={() => router.push("/profile")} className={styles.profileCard__name}>
                  {user.userId?.name || "Raju Ansary"}
                </h3>
                <p className={styles.profileCard__headline}>{user.currentPost || "Full-Stack Developer"}</p>
                <p className={styles.profileCard__location}>{user.bio || ""}</p>
              </div>
              <div className={styles.profileCard__divider}></div>
              <div className={styles.profileCard__stats}>
                <div className={styles.statRow} onClick={() => router.push("/my_connections")}>
                  <span>Connections</span>
                  <span className={styles.statNum}>{authState.connections?.length || 0}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.sideNav}>
            <div onClick={() => router.push("/dashboard")} className={`${styles.sideNavItem} ${router.pathname === "/dashboard" ? styles.sideNavActive : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              Saved items
            </div>
            <div onClick={() => router.push("/discover")} className={`${styles.sideNavItem} ${router.pathname === "/discover" ? styles.sideNavActive : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              Discover People
            </div>
            <div onClick={() => router.push("/my_connections")} className={`${styles.sideNavItem} ${router.pathname === "/my_connections" ? styles.sideNavActive : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              My Connections
            </div>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className={styles.mainFeed}>
          {children}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className={styles.rightSidebar}>
          <div className={styles.newsCard}>
            <h3 className={styles.newsCard__title}>ProConnect News</h3>
            <div className={styles.newsCard__item}>
              <span className={styles.newsDot}></span>
              <div>
                <p className={styles.newsHeadline}>Connect with professionals</p>
                <p className={styles.newsMeta}>Build your network today</p>
              </div>
            </div>
            <div className={styles.newsCard__item}>
              <span className={styles.newsDot}></span>
              <div>
                <p className={styles.newsHeadline}>Share your achievements</p>
                <p className={styles.newsMeta}>Post updates & milestones</p>
              </div>
            </div>
            <div className={styles.newsCard__item}>
              <span className={styles.newsDot}></span>
              <div>
                <p className={styles.newsHeadline}>Discover top profiles</p>
                <p className={styles.newsMeta}>Find people in your field</p>
              </div>
            </div>
          </div>

          {authState.all_profiles_fetched && authState.all_users.length > 0 && (
            <div className={styles.suggestCard}>
              <h3 className={styles.suggestCard__title}>People you may know</h3>
              {authState.all_users.slice(0, 3).map((profile) => (
                <div key={profile._id} className={styles.suggestItem} onClick={() => router.push(`/view_profile/${profile.userId.username}`)}>
                  <img src={`${BASE_URL}/${profile.userId.profilePicture}`} alt="" className={styles.suggestAvatar} />
                  <div>
                    <p className={styles.suggestName}>{profile.userId.name}</p>
                    <p className={styles.suggestSub}>{profile.userId.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}

export default DashboardLayout;