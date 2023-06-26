import { ChangeEvent, Dispatch, useRef, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useUser } from '../hooks/useUser';

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
      <ChangeAvatar setReload={setReload} />
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
  const [isValid, setIsValid] = useState<boolean>(false);
  const axiosInstance = useAxiosPrivate();

  const formStyle = {
    borderRadius: '30px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.19)',
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.13)',
    background: 'transparent',
    paddingLeft: '8px',
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (e.target.value.length < 4) {
      setIsValid(false)
    } else {
      setIsValid(true)
    }
  };

  const onClick = () => {
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
      <button disabled={isValid ? false : true} onClick={onClick}>
        Apply
      </button>
    </form>
  );
}

type ChangeAvatarProps = {
  setReload: Dispatch<React.SetStateAction<number>>;
};

function ChangeAvatar({ setReload }: ChangeAvatarProps) {
  const axiosInstance = useAxiosPrivate();
  const { setMyAvatar } = useUser();
  const [file, setFile] = useState<File>();

  console.log('ChangeAvatar Component loaded');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      console.log('No file');
      return;
    }

    console.log('RUnning axios');
    axiosInstance
      .post(
        '/user/upload-avatar',
        { file },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then((res) => {
        console.log('Request resolved', res.data);
        setMyAvatar(res.data);
        setFile(undefined);
        setReload((curr) => {
          return curr + 1;
        });
      })
      .catch((err) => {
        console.log('patch user/me with ChangeAvatar failed');
        console.log(err.response.data.message);
        setFile(undefined);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div>{file && `${file.name} - ${file.type}`}</div>
      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}
