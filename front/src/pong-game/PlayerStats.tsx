// export default function PlayerStats(ctx: CanvasRenderingContext2D, player: { name: string; score: number; }) {
//   // Name
//   ctx.font = "25px Montserrat Alternates";
//   ctx.fillStyle = "rgba(29, 29, 27)";
//   ctx.fillText(`${player.name}`, window.innerWidth / 4, 60); // player 1
//   ctx.fillText(`${player.name}`, window.innerWidth / 2 - 30, 60); // player 2



//   // Score
//   ctx.font = "25px Montserrat Alternates";
//   ctx.fillStyle = "rgba(29, 29, 27)";
//   ctx.fillText(`${player.score}`, (window.innerWidth / 4) + 30, 90); // player 1
//   ctx.fillText(`${player.score}`, (window.innerWidth / 2), 90); // player 2
// }

const PlayerStats = (props: {playerName: string, playerScore: number}) => {

  const { playerName, playerScore } = props;

  return (
      <div className="single-player-stats">
          <p> {`${playerName}`}</p>
          <p> {`${playerScore}`}</p>
      </div>
  )   
}

export default PlayerStats