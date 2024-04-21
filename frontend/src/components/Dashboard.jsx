import React from "react";
import { Button } from "antd";
import {
  SignedIn,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import Steper from "./Steper";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  // console.log(isSignedIn);
  const handleSignIn = () => {
    console.log("sign in");

    navigate("/signin");
  };
  if (!isSignedIn) {
    localStorage.removeItem("isHrInterviewDone");
  }

  return (
    <div>
      {isSignedIn ? (
        <div className="ml-[1400px] mt-4 h-10">
          <UserButton/>
        </div>
      ) : (
        <SignInButton className="ml-[1400px] mt-5 mb-5 primary bg-blue-500 rounded-lg py-2 px-4" />
      )}
      <Steper />
    </div>
  );
};

export default Dashboard;
