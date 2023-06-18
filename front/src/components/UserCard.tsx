import { Link } from "react-router-dom";
import "../style/components/user-card.css";
import { useUser } from "../context/UserProvider";
import { User } from "../types/User.type";

const UserCard = ({user}: {user: User}) => {
  // const { name, avatar, level } = useUser();

  return (
    <>
      <Link to={"/profil"} className="user-card">
        <img className="avatar" alt="avatar" src={user?.avatar} />
        <div className="user-short-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-level">{`Level ${user?.level ? Math.floor(user.level): 0}`}</p>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
