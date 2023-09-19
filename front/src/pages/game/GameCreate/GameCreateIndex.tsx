import { useState } from 'react';
import GameCreateSelect from '../../../components/game/GameCreate/GameCreateSelect';

function GameCreateIndex() {
  const [error, setError] = useState<string>('');

  return (
    <>
      <GameCreateSelect />
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}

export default GameCreateIndex;
