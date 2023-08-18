import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function ChannelOptions() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const optionLoc: string = pathname.substring(pathname.lastIndexOf('/') + 1);

  return (
    <div className="options-window">
      <div className="options-header">
        <div
          className={'options-tab'}
          onClick={() => {
            navigate('members');
          }}
        >
          <p
            className={
              optionLoc === 'members' ? 'text-black-500' : 'text-gray-500'
            }
          >
            Members
          </p>
        </div>
        <div
          className="options-tab"
          onClick={() => {
            navigate('settings');
          }}
        >
          <p
            className={
              optionLoc === 'settings' ? 'text-black-500' : 'text-gray-500'
            }
          >
            Settings
          </p>
        </div>
      </div>
      <div className="options-body">
        <Outlet />
      </div>
    </div>
  );
}
