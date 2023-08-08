import { useState } from 'react';

type paddleOption = {
  size: string;
  deathMargin: string;
};

export default function GameCreatePoint() {
  const [p1Paddle, setP1Paddle] = useState<paddleOption>({
    size: '0.1',
    deathMargin: '0.02',
  });

  const [p2Paddle, setP2Paddle] = useState<paddleOption>({
    size: '0.1',
    deathMargin: '0.02',
  });

  return (
    <div className="w-full flex-col-center">
      <div className="border-4 border-blue-950  w-full">
        <div className="text-3xl text-center">Choose paddle size</div>
        <div className="flex-row-center">
          <div className="flex-1 text-center">
            <div>Player 1</div>
            <select
              value={p1Paddle.size}
              onChange={(e) => {
                setP1Paddle({ ...p1Paddle, size: e.target.value });
              }}
            >
              <option value="0.05">Hard</option>
              <option value="0.1">Normal</option>
              <option value="0.15">Easy</option>
            </select>
          </div>
          <div className="flex-1 text-center">
            <div>Player 2</div>
            <select
              value={p2Paddle.size}
              onChange={(e) => {
                setP2Paddle({ ...p2Paddle, size: e.target.value });
              }}
            >
              <option value="0.05">Hard</option>
              <option value="0.1">Normal</option>
              <option value="0.15">Easy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="h-[20px]"></div>

      <div className="border-4 border-blue-950  w-full">
        <div className="text-3xl text-center">Choose Margin of death</div>
        <div className="flex-row-center">
          <div className="flex-1 text-center">
            <div>Player 1</div>
            <select
              value={p1Paddle.size}
              onChange={(e) => {
                setP1Paddle({ ...p1Paddle, size: e.target.value });
              }}
            >
              <option value="0.05">Hard</option>
              <option value="0.1">Normal</option>
              <option value="0.15">Easy</option>
            </select>
          </div>
          <div className="flex-1 text-center">
            <div>Player 2</div>
            <select
              value={p2Paddle.size}
              onChange={(e) => {
                setP2Paddle({ ...p2Paddle, size: e.target.value });
              }}
            >
              <option value="0.05">Hard</option>
              <option value="0.1">Normal</option>
              <option value="0.15">Easy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="h-[20px]"></div>

      <div className="border-4 border-blue-950  w-full text-center">
        <div className="text-3xl">Invite friends</div>
      </div>
    </div>
  );
}
