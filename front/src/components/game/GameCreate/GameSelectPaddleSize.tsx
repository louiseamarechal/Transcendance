type GameSelectPaddleSizeProps = {
  text: string;
  paddleSize: number;
  setPaddleSize: any;
};

function GameSelectPaddleSize(props: GameSelectPaddleSizeProps) {
  return (
    <div className="flex-col-center">
      <div>{props.text}</div>
      <select
        value={props.paddleSize}
        onChange={(e) => props.setPaddleSize(e.target.value)}
      >
        <option value={0.1}>normal</option>
        <option value={0.05}>small</option>
        <option value={0.2}>big</option>
      </select>
    </div>
  );
}

export default GameSelectPaddleSize;
