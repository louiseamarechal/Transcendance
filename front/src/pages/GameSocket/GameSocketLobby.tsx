import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export default function GameSocketLobby() {
  const navigate = useNavigate();
  const axiosInstance = useAxiosPrivate();

  const handleSearchGame = async () => {
    // api call to check for a game
    let queue: any[];
    try {
      const response = await axiosInstance.get('/game/queue')
      queue = response.data
    } catch (err) {
      console.log('request /game/queue failed', err)
      return
    }

    console.log({ queue });

    if (queue.length === 0) {
      // if no one is seaching for a game, navigate to the queue page
      navigate('/gamesocket/queue')
    } else {
      // if there is someone in the queue, create a game
      navigate('/gamesocket/game')
    }
  };

  return (
    <div className="gamepage-container">
      <h1 className="gamepage-title">PONG</h1>
      <div className="net-container">
        <button className="searchgame-button mr-2" onClick={handleSearchGame}>
          Search Game
        </button>
        <div className="net"></div>
        <button className="searchgame-button m1-2">Invite Friends</button>
      </div>
    </div>
  );
}
