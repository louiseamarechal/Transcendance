import '../../style/components/net.css';
import '../../style/components/buttons.css';
import '../../style/pages/Game.css';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Game() {
  const axiosPrivate = useAxiosPrivate();

  const getUser = async () => {
    const reponse = await axiosPrivate.get('/user/me');
    console.log(reponse);
  };
  return (
    <>
      <div className="gamepage-container">
        <h1 className="gamepage-title">PONG</h1>
        <div className="net-container">
          <Link to={'/wait'}>
            <button
              className="searchgame-button mr-2"            >
              Search Game
            </button>
          </Link>
          <div className="net"></div>
          <Link to={'/findfriends'}>
            <button
              className="searchgame-button m1-2"            >
              Invite Friends
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Game;
