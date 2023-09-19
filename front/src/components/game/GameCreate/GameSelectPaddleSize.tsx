import NiceBox from '../../ui/NiceBox';

type GameSelectPaddleSizeProps = {
  selectedFriendName: string;
  P1PaddleSize: number;
  setP1PaddleSize: React.Dispatch<React.SetStateAction<number>>;
  P2PaddleSize: number;
  setP2PaddleSize: React.Dispatch<React.SetStateAction<number>>;
};

function GameSelectPaddleSize(props: GameSelectPaddleSizeProps) {
  return (
    <NiceBox title="Select Paddle Size">
      <p>You</p>
      <select
        value={props.P1PaddleSize}
        onChange={(e) => props.setP1PaddleSize(Number(e.target.value))}
      >
        <option value={0.1}>normal</option>
        <option value={0.05}>small</option>
        <option value={0.2}>big</option>
      </select>
      <div className="my-2"></div>

      <p>{props.selectedFriendName}</p>
      <select
        value={props.P2PaddleSize}
        onChange={(e) => props.setP2PaddleSize(Number(e.target.value))}
      >
        <option value={0.1}>normal</option>
        <option value={0.05}>small</option>
        <option value={0.2}>big</option>
      </select>
    </NiceBox>
  );

  // return (
  //   <div className="flex-col-center">
  //     <div>{props.text}</div>
  //     <select
  //       value={props.paddleSize}
  //       onChange={(e) => props.setPaddleSize(e.target.value)}
  //     >
  //       <option value={0.1}>normal</option>
  //       <option value={0.05}>small</option>
  //       <option value={0.2}>big</option>
  //     </select>
  //   </div>
  // );
}

export default GameSelectPaddleSize;
