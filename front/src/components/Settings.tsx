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

      <ChangeAvatar setReload={setReload} />
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
  const [isValid, setIsValid] = useState<boolean>(false);
  const axiosInstance = useAxiosPrivate();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    if (e.target.value.length < 4) {
      setIsValid(false)
    } else {
      setIsValid(true)
    }
  };

  const onClick = () => {
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
    <div>
      <input
        type="text"
        value={name}
        onChange={onChange}
      />
      {!isValid && <p>More!!!</p>}
      {error && <p>{error}</p>}
      <button disabled={isValid ? false : true} onClick={onClick}>
        Apply
      </button>
    </div>
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
