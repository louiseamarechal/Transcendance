// import React from "react";
import { useEffect, useState } from 'react';
import { ProfilStat } from '../components/ProfilStat.tsx';
import ProgressBar from '../components/ProgressBar.tsx';
import UserCard from '../components/UserCard.tsx';
import '../style/pages/Profil.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
import { User } from '../types/User.type.ts';
import Settings, { ChangeName, Toggle2FA } from '../components/Settings.tsx';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '../components/Avatar.tsx';

function Profil() {
  // Profil page will depend on the user id => see later on
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<User>({});
  const [isLoading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<number>(0);
  const [changingUsername, setChangingUsername] = useState(false);
  const [is2FAset, setIs2FAEnabled] = useState(false);
  const [image, setImage] = useState({ preview: '', data: '' });
  const [status, setStatus] = useState('');

  console.log('Entering Profil component');

  useEffect(() => {
    axiosInstance.get('user/me').then((res) => {
      if (res.data.s2fa === 'SET') setIs2FAEnabled(true);
    });
  }, []);

  const handle2FA = () => {
    if (is2FAset === false) {
      axiosInstance.patch('user/me', { s2fa: 'SET' });
      setIs2FAEnabled(true);
    }
    if (is2FAset === true) {
      axiosInstance.patch('user/me', { s2fa: 'NOTSET' });
      setIs2FAEnabled(false);
    }
  };
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
    axiosInstance
      .get('user/me')
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((e) => console.log(e));
    console.log({ user });
  }, [reload]);

  if (isLoading) {
    return <div className="grid place-items-center h-screen">Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', image.data);
    // console.log(formData);
    console.log(image.data);
    const response = await axiosInstance.post('user/upload-avatar', formData);
    if (response) setStatus(response.statusText);
    console.log(status);
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  }; // function changeAvatar(avatar: string) {
  //   axiosInstance.post('user/upload-avatar');
  // }

  return (
    // <div className="grid grid-cols-1 place-items-center pt-[10%]">
    <div className="profil-container">
      <div className="profil-card">
        <div className="inline-block relative">
          {image.data ? (
            image.preview && <img src={image.preview} className="avatar" />
          ) : (
            <Avatar id={user.id} />
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              onChange={handleFileChange}
              // onChange={(event) => changeAvatar(event.target.value)}
              className="avatar-sm form-avatar"
            />
            <button type="submit">√</button>
          </form>
        </div>
        {!changingUsername ? (
          <div className="flex flex-row items-center gap-2">
            <p className="user-name">{user?.name}</p>
            <button onClick={() => setChangingUsername(true)}>
              <FontAwesomeIcon
                icon={faPen}
                style={{ color: 'var(--faded-black)' }}
              />
            </button>
          </div>
        ) : (
          <ChangeName
            setReload={setReload}
            setChangingUsername={setChangingUsername}
          />
        )}
      </div>
      {/* <UserCard user={user} /> */}
      <ProgressBar user={user} />
      <div className={divStyle}>
        <ProfilStat user={user} />
        <div className="line"></div>
        <div className="game-history"></div>
        <button
          className="small-button friend-request-button"
          onClick={handle2FA}
        >
          {' '}
          {is2FAset ? 'Unset 2FA' : 'Set 2FA'}{' '}
        </button>
      </div>

      {/* <Settings setReload={setReload} /> */}
    </div>
  );
}

export default Profil;
