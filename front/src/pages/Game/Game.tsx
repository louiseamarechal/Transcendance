import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.ts';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.ts';

function Game() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  console.log({ auth_refresh_token: auth.refresh_token });
  console.log({ auth_access_token: auth.access_token });

  const getUser = async () => {
    const reponse = await axiosPrivate.get('/user/me');
    console.log(reponse);
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <p>Game Page in progress</p>
        <Link to="/playgame" className='play-game-button'>
            <div className="play-game-triangle"></div>
        </Link>
      </div>
      <button onClick={() => getUser()}>User</button>
    </>
  );
}

export default Game;
