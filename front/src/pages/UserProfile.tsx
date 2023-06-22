import { Navigate, redirect, useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { User } from '../types/User.type';
// import UserCard from '../components/UserCard';
import ProgressBar from '../components/ProgressBar';
import { ProfilStat } from '../components/ProfilStat';

export default function UserProfile() {
  const { id } = useParams();
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<User>({});
  const [isLoading, setLoading] = useState<boolean>(true);
  const { myId } = useUser();
  const navigate = useNavigate();

  console.log('Entering UserProfile component with id =', id);

  const divStyle = [
    'w-3/5',
    'h-3/5',
    'flex flex-row items-start justify-evenly gap-10 pt-6',
    'border-t-[1px]',
    'border-r-[2px]',
    'border-b-[2px]',
    'border-l-[1px]',
    'border-[#0000001C]',
    'rounded-[50px]',
    'shadow-lg',
    'flex-wrap',
  ].join(' ');

  useEffect(() => {
    if (myId.toString() === id) {
      navigate('/profil');
    }

    axiosInstance
      .get(`user/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((e) => {
        navigate('/game');
      });
  }, [id]);

  if (isLoading) {
    return <div className="grid place-items-center h-screen">Loading...</div>;
  }

  return (
    <div className="profil-container">
      <div className="flex flex-row">
        <div className="profil-card">
          <img className="avatar" alt="avatar" src={user?.avatar} />
          <div className="flex flex-row items-center">
            <p className="user-name">{user?.name}</p>
          </div>
        </div>
        <ActionButtons />
      </div>
      <ProgressBar user={user} />
      <div className={divStyle}>
        <ProfilStat user={user} />
      </div>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex flex-col gap-2">
      <button className="small-button friend-request-button">Add friend</button>
      <button className='small-button game-request-button'>Send game request</button>
    </div>
  );
}
