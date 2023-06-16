// import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/components/user-card.css";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { User } from "../types/User.type";

const UserCard = () => {
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<User>({});

  const getMe = async () => {
    const response = await axiosInstance.get("/user/me");
    setUser(response.data);
  };

  useEffect(() => {
    getMe();
  }, []);
  return (
    <>
      <Link to={"/profil"} className="user-card">
        <img className="avatar" alt="avatar" src={user.avatar} />
        <div className="user-short-info">
          <p className="user-name">{user.name}</p>
          <p className="user-level">{`Level ${Math.floor(user.level)}`}</p>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
