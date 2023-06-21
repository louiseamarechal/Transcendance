import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function Settings() {
  console.log('Entering Settings component');

  return (
    <div>
      <h1>Settings</h1>
      <Toggle
        label="2FA"
        toggled={false}
        onClick={(state: boolean) => console.log(`State: ${state}`)}
      />
      <div>
        <input type="text" />
        <strong>Change name</strong>
      </div>
      <div>
        <input type="file" />
        <button>
          <strong>Change picture</strong>
        </button>
      </div>
    </div>
  );
}

type ToggleProps = {
  label: string;
  toggled: boolean;
  onClick: Function;
};

function Toggle({ label, toggled, onClick }: ToggleProps) {
  const [isToggle, toggle] = useState(toggled);
  const axiosInstance = useAxiosPrivate();

  const callback = () => {
    toggle(!isToggle);
    onClick(!isToggle);

    const s2fa = !isToggle ? 'SET' : 'NOTSET';
    axiosInstance.patch('user/me', { s2fa }).catch(() => {
      console.log('patch user/me failed');
    });
  };

  return (
    <label>
      <input type="checkbox" defaultChecked={isToggle} onClick={callback} />
      <strong>{label}</strong>
    </label>
  );
}
