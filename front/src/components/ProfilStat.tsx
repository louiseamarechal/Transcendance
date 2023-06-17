const divStyle = [
  "w-3/5 mx-auto",
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  "border-2 border-red-800",
].join(" ");

export const ProfilStat = () => {
  return (
    <div className={divStyle}>
      <div className="m-auto">Victoires:</div>
      <div className="m-auto">Defaites:</div>
      <div className="m-auto">Taux de victoire:</div>
      <div className="m-auto">Other:</div>
    </div>
  );
};
