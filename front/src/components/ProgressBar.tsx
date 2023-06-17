import "../style/components/progress-bar.css";
import { useUser } from "../context/UserProvider";
import { CSSProperties } from "react";

type Props = {
  completed?: string
}

function ProgressBar(props: Props) {
  const { completed } = props;
  const { level } = useUser();

  const containerStyles: CSSProperties = {
    height: 20,
    width: "30%",
    backgroundColor: "",
    border: "1px solid var(--border)",
    borderRadius: 20,
  };

  const fillerStyles: CSSProperties = {
    height: "100%",
    width: `${completed || Math.round((level - Math.floor(level)) * 100)}%`,
    backgroundColor: "var(--blue)",
    borderRadius: "inherit",
    textAlign: "right",
    display: "flex",
    alignItems: "center",
    justifyContent: "right",
  };

  const labelStyles: CSSProperties = {
    color: "var(--black)",
    fontFamily: "Montserrat Alternates",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    //   need to find a way to center this bad boy
  };

  return (
    <div className="progress-bar" style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${
          completed || Math.round((level - Math.floor(level)) * 100)
        }%`}</span>
      </div>
    </div>
  );
}

export default ProgressBar;
