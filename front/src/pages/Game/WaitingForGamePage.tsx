import { useEffect, useState } from 'react';
import '../../style/pages/Game/WaitingForGamePage.css';

const WaitingForGame = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 20000); // adapt loading time to when we find a player
  }, []);

  return (
    <div className="waiting-for-game">
      <h1 className="pong-title">PONG</h1>
      <p>Wait until we find you the perfect match !</p>
      <br />
      {loading ? <div className="spinner"></div> : <div></div>}
    </div>
  );
};

export default WaitingForGame;
