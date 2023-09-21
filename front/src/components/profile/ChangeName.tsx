import { ChangeEvent, Dispatch, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

type ChangeNameProps = {
  setReload: Dispatch<React.SetStateAction<number>>;
  setChangingUsername: Dispatch<React.SetStateAction<boolean>>;
};

export function ChangeName({
  setReload,
  setChangingUsername,
}: ChangeNameProps) {
  const [name, setName] = useState<string>('');
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

    setChangingUsername(false);
    axiosInstance
      .patch('user/me', { name })
      .then(() => {
        setName('');
        setReload((curr) => {
          return curr + 1;
        });
      })
      .catch(() => {
        console.log('patch user/me with ChangeName failed');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={formStyle}
        />
      </label>
      <input type="submit" value="  Apply" />
    </form>
  );
}
