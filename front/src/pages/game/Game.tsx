import '../../style/components/net.css';
import '../../style/components/buttons.css';
import '../../style/pages/Game.css';
import { Link, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

function OldGame() {
  return <Outlet />;
}

export default OldGame;
