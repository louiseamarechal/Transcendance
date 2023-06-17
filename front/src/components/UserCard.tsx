import { Link } from "react-router-dom";
import "../style/components/user-card.css";
import { useUser } from "../context/UserProvider";

const UserCard = () => {
  const { name, avatar, level } = useUser();

  return (
    <>
      <Link to={"/profil"} className="user-card">
        <img className="avatar" alt="avatar" src={avatar} />
        <div className="user-short-info">
          <p className="user-name">{name}</p>
          <p className="user-level">{`Level ${Math.floor(level)}`}</p>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
