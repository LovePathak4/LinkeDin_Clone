import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className={inter.className}>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <div className={styles.mainContainer__left}>
              <p>Connect With Friends Without Exaggeration.</p>
              <p>A true Social media platform with stories no blufs!</p>

              <div
                onClick={() => router.push("/login")}
                className={styles.buttonJoin}
              >
                <p>Join Now</p>
              </div>
            </div>

            <div className={styles.mainContainer__right}>
              <img
                src="/images/Connected world-amico.png"
                alt="illustration"
                width={300}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}