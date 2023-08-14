import { useState } from 'react';

export default function GameCreate() {
  const [mode, setMode] = useState<string>('point');

  return (
    <>
      <div>Choose mode</div>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="timed">Timed</option>
        <option value="point">Point</option>
      </select>
    </>
  );
}
