import { ChangeEvent, Dispatch, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

type SettingsProps = {
  setReload: Dispatch<React.SetStateAction<number>>;
};

export default function Settings({ setReload }: SettingsProps) {
  console.log('Entering Settings component');

  return (
    <div>
      <br />
      <br />

      <h1>Settings</h1>

      <br />
      <br />

      <Toggle2FA toggled={false} />

      <br />
      <br />

      <ChangeName setReload={setReload} />

      <br />
      <br />

      <ChangeAvatar />
    </div>
  );
}

type Toggle2FAProps = {
  toggled: boolean;
};

function Toggle2FA({ toggled }: Toggle2FAProps) {
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
    <label>
      <input type="checkbox" defaultChecked={isToggle} onClick={callback} />
      <strong>2FA</strong>
    </label>
  );
}

type ChangeNameProps = {
  setReload: Dispatch<React.SetStateAction<number>>;
};

function ChangeName({ setReload }: ChangeNameProps) {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const axiosInstance = useAxiosPrivate();

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

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
        Change your name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <input type="submit" value="Apply" />
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
