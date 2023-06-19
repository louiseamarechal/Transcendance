// import React from "react";
import '../style/components/progress-bar.css';

function ProgressBar(props: any) {
  const { completed } = props;

  const containerStyles = {
    height: 20,
    width: '30%',
    backgroundColor: '',
    border: '1px solid var(--border)',
    borderRadius: 20,
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: 'var(--blue)',
    borderRadius: 'inherit',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
  };

  const labelStyles = {
    color: 'var(--black)',
    fontFamily: 'Montserrat Alternates',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    //   need to find a way to center this bad boy
  };

  return (
    <div className="progress-bar" style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
}

export default ProgressBar;
