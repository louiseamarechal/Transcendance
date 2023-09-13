import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

export default function ChannelOptions() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log({ pathname });
  const optionLoc: string = pathname.substring(pathname.lastIndexOf('/') + 1);
  console.log({ optionLoc });
  const [searchParams] = useSearchParams();
  const isDM: boolean = searchParams.get('isDM') === 'true';

  return (
    <div className="options-window">
      <div className="options-header">
        <div
          className={'options-tab'}
          onClick={() => {
            navigate(`members?isDM=${isDM}`);
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
            navigate(`settings?isDM=${isDM}`);
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
