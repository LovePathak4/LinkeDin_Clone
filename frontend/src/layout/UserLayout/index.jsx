import NavbarComponent from "@/Components/Navbar";
import React from "react";

function UserLayout({ children }) {
  return (
    <div style={{ background: "#f3f2ef", minHeight: "100vh" }}>
      <NavbarComponent />
      {children}
    </div>
  );
}

export default UserLayout;