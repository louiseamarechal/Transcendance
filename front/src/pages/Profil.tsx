// import React from "react";
import { useEffect, useState } from 'react';
import { ProfilStat } from '../components/ProfilStat.tsx';
import ProgressBar from '../components/ProgressBar.tsx';
import UserCard from '../components/UserCard.tsx';
import '../style/pages/Profil.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
import { User } from '../types/User.type.ts';
import Settings from '../components/Settings.tsx';

function Profil() {
  // Profil page will depend on the user id => see later on
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<User>({});
  const [isLoading, setLoading] = useState<boolean>(true);

  console.log('Entering Profil component');

  useEffect(() => {
    axiosInstance
      .get('user/me')
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((e) => console.log(e));
    console.log({ user });
  }, []);

  if (isLoading) {
    return <div className="grid place-items-center h-screen">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 place-items-center pt-[10%]">
      <UserCard user={user} />
      <ProgressBar user={user} />
      <ProfilStat user={user} />
      <Settings />
    </div>
  );
}

export default Profil;
