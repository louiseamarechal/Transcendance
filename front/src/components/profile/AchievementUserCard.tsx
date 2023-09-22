type AchivementUserCardProps = { image: string };

function AchievementUserCard({ image }: AchivementUserCardProps) {
  let style =
    'w-28 h-28 rounded-lg flex m-2  whitespace border border-black content-center overflow-hidden';
  return (
    <div className={style}>
      <img src={image} />
    </div>
  );
}

export default AchievementUserCard;
