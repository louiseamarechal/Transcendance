import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { socket } from '../../api/socket';

export default function GameSocketLobby() {
  const navigate = useNavigate();
  const axiosInstance = useAxiosPrivate();

  const handleSearchGame = async () => {
    // api call to check for a game
    let queue: any[];
    try {
      const response = await axiosInstance.get('/game/queue');
      queue = response.data;
    } catch (err) {
      console.log('request /game/queue failed', err);
      return;
    }

    console.log({ queue });

    if (queue.length === 0) {
      // if no one is seaching for a game, navigate to the queue page
      try {
        await axiosInstance.get('/game/join-queue');
      } catch (err) {
        console.log('request /game/join-queue failed', err);
        return;
      }
      navigate('/gamesocket/queue');
    } else {
      // if there is someone in the queue, create a game
      try {
        // send to server we want to join a game
        const response = await axiosInstance.get('/game/start-game')
        // receive a game id
        const gameId = response.data
        // navigate to the game id
        navigate(`/gamesocket/${gameId}`);
      } catch (err) {
        console.log('request /game/start-game failed', err);
        return;
      }
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
      <button onClick={() => {socket.emit('eventname', 'eventdata')}}>Test</button>
    </div>
  );
}
