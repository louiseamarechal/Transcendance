// import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../style/components/user-card.css';

const UserCard = () => {
  return (
    <>
      <Link to={'/profil'} className="user-card">
        <img
          className="avatar"
          alt="avatar"
          src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg"
        />
        <div className="user-short-info">
          <p className="user-name">lmarecha</p>
          <p className="user-level">User Level</p>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
