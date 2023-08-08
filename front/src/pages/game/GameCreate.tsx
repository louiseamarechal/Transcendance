import { useState } from 'react';
import '../../style/flexUtils.css';
import GameCreatePoint from '../../components/game/GameCreate/GameCreatePoint';
import GameCreateTimed from '../../components/game/GameCreate/GameCreateTimed';

export default function GameCreate() {
  const [mode, setMode] = useState<string>('point');

  let subComponent;
  switch (mode) {
    case 'point':
      subComponent = <GameCreatePoint />;
      break;
    case 'timed':
      subComponent = <GameCreateTimed />;
      break;
    default:
      subComponent = null;
      break;
  }

  return (
    <div className="h-full flex-row-center overflow-auto">
      <div className="border-8 border-red-700 w-[80%] flex-col-center">
        <div>Choose mode</div>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="timed">Timed</option>
          <option value="point">Point</option>
        </select>
        {subComponent}
      </div>
    </div>
  );
}
