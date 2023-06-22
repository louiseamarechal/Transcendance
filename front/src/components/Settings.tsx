import { ChangeEvent, Dispatch, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

type SettingsProps = {
  setReload: Dispatch<React.SetStateAction<number>>;
};

export default function Settings({ setReload }: SettingsProps) {
  console.log('Entering Settings component');

  return (
    <div>
      <h1>Settings</h1>
      <Toggle2FA toggled={false} />
      <ChangeName setReload={setReload} />
      <ChangeAvatar />
    </div>
  );
}

type Toggle2FAProps = {
  toggled: boolean;
};

export function Toggle2FA({ toggled }: Toggle2FAProps) {
  const [isToggle, toggle] = useState(toggled);
  const axiosInstance = useAxiosPrivate();

  const callback = () => {
    toggle(!isToggle);

    const s2fa = !isToggle ? 'SET' : 'NOTSET';
    axiosInstance.patch('user/me', { s2fa }).catch(() => {
      console.log('patch user/me with 2fa failed');
    });
  };

  return (
    <label className='flex flex row items-center justify-center gap-2'>
      <input type="checkbox" defaultChecked={isToggle} onClick={callback} />
      <p>2FA</p>
    </label>
  );
}

type ChangeNameProps = {
  setReload: Dispatch<React.SetStateAction<number>>;
  setChangingUsername: Dispatch<React.SetStateAction<boolean>>;
};

export function ChangeName({
  setReload,
  setChangingUsername,
}: ChangeNameProps) {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const axiosInstance = useAxiosPrivate();

  const formStyle = {
    borderRadius: '30px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.19)',
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.13)',
    background: 'transparent',
    paddingLeft: '8px',
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    setChangingUsername(false);
    axiosInstance
      .patch('user/me', { name })
      .then(() => {
        setName('');
        setReload((curr) => {
          return curr + 1;
        });
      })
      .catch((error) => {
        console.log('patch user/me with ChangeName failed');
        setError(error.response.data.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {/* Change your name: */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={formStyle}
        />
      </label>
      <input type="submit" value="  Apply" />
      {error && <p>{error}</p>}
    </form>
  );
}

function ChangeAvatar() {
  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('ca fé ri1 lol');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input type="file" />
      </label>
      <input type="submit" value="Apply" />
    </form>
  );
}
