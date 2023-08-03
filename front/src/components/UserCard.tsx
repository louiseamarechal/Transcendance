// import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../style/components/user-card.css';
import { User } from '../types/User.type';
import Avatar from './Avatar';

const UserCard = ({ user }: { user: User }) => {
  return (
    <>
      <Link to={`/profil/${user.id}`} className="user-card">
        <Avatar id={user.id}/>
        <div className="user-short-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-level">{`Level ${
            user?.level ? Math.floor(user.level) : 0
          }`}</p>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
