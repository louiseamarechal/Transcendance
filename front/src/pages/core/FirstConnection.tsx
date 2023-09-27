import { ChangeEvent, useState } from 'react';
import NiceBox from '../../components/ui/NiceBox';
import NiceButton from '../../components/ui/NiceButton';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

function FirstConnection() {
  const axiosInstance = useAxiosPrivate();
  const navigate = useNavigate();

  const [newName, setNewName] = useState<string>('');
  const [newAvatar, setNewAvatar] = useState<File>();

  function onChangeAvatar(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setNewAvatar(e.target.files[0]);
  }

  function handleChangeAvatar() {
    if (!newAvatar) return;

    const formData = new FormData();
    formData.append('file', newAvatar);

    axiosInstance
      .post('/user/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        alert('Your avatar has been changed!');
        setNewAvatar(undefined);
      })
      .catch(() => {});
  }

  function handleChangeName() {
    if (!newName) return;

    axiosInstance
      .patch('user/me', { name: newName })
      .then(() => {
        alert(`Your name has been changed to ${newName}`);
        setNewName('');
      })
      .catch(() => {});
  }

  return (
    <div className="h-full flex flex-col justify-start items-center p-[50px]">
      <NiceBox title="Change your avatar">
        <input type="file" onChange={onChangeAvatar} />
        <NiceButton onClick={handleChangeAvatar}>Change Avatar</NiceButton>
      </NiceBox>

      <NiceBox title="Change your name">
        <input
          type="text"
          value={newName}
          maxLength={15}
          onChange={(e) => setNewName(e.target.value)}
        />
        <NiceButton onClick={handleChangeName}>Change Name</NiceButton>
      </NiceBox>

      <NiceButton
        onClick={() => {
          navigate('/game');
        }}
      >
        Get Started!
      </NiceButton>
    </div>
  );
}

export default FirstConnection;
