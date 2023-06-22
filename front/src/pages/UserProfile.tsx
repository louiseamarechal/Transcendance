import { Navigate, redirect, useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { User } from '../types/User.type';
import UserCard from '../components/UserCard';
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
    <div className="grid grid-cols-1 place-items-center pt-[10%]">
      <UserCard user={user} />
      <ActionButtons />
      <ProgressBar user={user} />
      <ProfilStat user={user} />
    </div>
  );
}

function ActionButtons () {
  return (
    <div className='fixed right-[10%] top-[10%]'>
      <button>Add friend do nothing</button>
      <br />
      <button>Invite to game do nothing</button>
    </div>
  )
}