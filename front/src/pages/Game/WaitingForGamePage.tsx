import { useEffect, useState } from 'react';
import '../../style/pages/Game/WaitingForGamePage.css';
import '../../style/components/spinner.css';
import { Navigate } from 'react-router-dom';

const WaitingForGame = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 9000); // adapt loading time to when we find a player or not
  }, []);

  return (
    <div className="waiting-for-game">
      <h1 className="pong-title">PONG</h1>
      <p>Wait until we find you the perfect match !</p>
      <br />
      {loading ? <div className="spinner"></div> : <Navigate to="/playgame" replace={true} />}
    </div>
  );
};

export default WaitingForGame;
