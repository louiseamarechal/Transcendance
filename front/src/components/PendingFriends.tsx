import { useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import UserCard from './UserCard';
import { PublicUser } from '../../../shared/common/types/user.type';

type PendingFriendsProps = {
  pendingFR: PublicUser[];
  setPendingFR: React.Dispatch<React.SetStateAction<PublicUser[]>>;
};

const PendingFriends = (props: PendingFriendsProps) => {
  const axiosInstance = useAxiosPrivate();
  // const [pendingFR, setPendingFR] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('user/pending-request')
      .then((res) => {
        props.setPendingFR(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  if (props.pendingFR.length > 0) {
    return (
      <div className="friend-inside-container">
        <h2>Pending Requests : </h2>
        <div className="all-friends-cards">
          {props.pendingFR.map((user, index) => {
            return (
              <div className="friend-card">
                <UserCard user={user} key={index} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return <></>;
};

export default PendingFriends;
