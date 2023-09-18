// import React from "react";
import { useEffect, useState } from 'react';
import ProgressBar from '../components/ProgressBar.tsx';
import '../style/pages/Profil.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate.ts';
import { ChangeName } from '../components/Settings.tsx';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '../components/Avatar.tsx';
import { PublicUser } from '../../../shared/common/types/user.type.ts';
import GameHistory from '../components/profile/GameHistory.tsx';
import { useUser } from '../hooks/useUser.ts';
import { GameSchema } from '../../../shared/common/types/game.type.ts';
import ProfileStatistics from '../components/profile/ProfileStatistics.tsx';
import ProfileSettings from '../components/profile/ProfileSettings.tsx';

function Profil() {
  // Profil page will depend on the user id => see later on
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<PublicUser>({} as PublicUser);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<number>(0);
  const [changingUsername, setChangingUsername] = useState(false);
  const [is2FAset, setIs2FAEnabled] = useState(false);
  const [image, setImage] = useState({ preview: '', data: '' });
  const [changingAvatar, setChangingAvatar] = useState(false);
  const [games, setGames] = useState<GameSchema[]>([]);
  const { myId } = useUser();

  console.log('Entering Profil component');

  useEffect(() => {
    axiosInstance.get('user/me').then((res) => {
      if (res.data.s2fa === 'SET') setIs2FAEnabled(true);
    });
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`game/${myId}`)
      .then((res) => {
        setGames(res.data);
      })
      .catch(() => {});
  }, [myId]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', image.data);
    console.log(image.data);
    try {
      await axiosInstance({
        method: 'post',
        url: '/user/upload-avatar',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.log(error);
    }
    setChangingAvatar(false);
  };

  const handleFileChange = (e: any) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
    setChangingAvatar(true);
  };

  if (isLoading) {
    return <div className="grid place-items-center h-screen">Loading...</div>;
  }

  return (
    // <div className="grid grid-cols-1 place-items-center pt-[10%]">
    <div className="profil-container">
      <div className="profil-card">
        <div className="inline-block relative flex flex-row items-end">
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
            {changingAvatar ? (
              <button type="submit" className="text-xs">
                ok
              </button>
            ) : (
              <></>
            )}
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
      {`Level ${Math.floor(user.level)} `}
      <ProgressBar user={user} />
      {/* <div className={divStyle}>
        <ProfilStat user={user} />
        <div className="line"></div>
        <button
          className="small-button friend-request-button"
          onClick={handle2FA}
        >
          {' '}
          {is2FAset ? 'Unset 2FA' : 'Set 2FA'}{' '}
        </button>
      </div> */}

      <ProfileStatistics games={games} userId={myId} />

      <GameHistory games={games} id={myId} />

      <ProfileSettings is2FASet={is2FAset} handle2FA={handle2FA} />
    </div>
  );
}

export default Profil;
