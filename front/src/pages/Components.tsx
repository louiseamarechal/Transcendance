import BACK_URL from '../api/backUrl.ts';
import ProgressBar from '../components/ProgressBar.tsx';
import UserCard from '../components/UserCard.tsx';
import '../style/components/net.css';
import { User } from '../types/User.type.ts';

const user: User = {
  name: 'toto',
  avatar: `${BACK_URL}/public/default.jpg`,
  level: 99999.80,
};

function Components() {
  return (
    <div className="">
      {/* <NavBar /> */}
      <div className="flex flex-col justify-center items-center gap-y-2">
        <button className="small-button friend-request-button">
          Send friend request
        </button>
        <button className="small-button game-request-button">
          Send game request
        </button>
        <button className="small-button friend-button">Friends</button>
        <button className="play-game-button flex justify-center items-center">
          <div className="play-game-triangle"></div>
        </button>
        <button className="decline-game">X</button>
        <ProgressBar user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
        <UserCard user={user} />
      </div>
    </div>
  );
}

export default Components;
