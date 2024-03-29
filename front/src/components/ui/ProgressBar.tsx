import '../../style/components/progress-bar.css';
import { CSSProperties } from 'react';
import { PublicUser } from '../../../../shared/common/types/user.type';

type Props = {
  user: PublicUser;
};

function ProgressBar({ user }: Props) {
  const containerStyles: CSSProperties = {
    height: 20,
    width: '50%',
    backgroundColor: '',
    border: '1px solid var(--border)',
    borderRadius: 20,
  };

  const fillerStyles: CSSProperties = {
    height: '100%',
    width: `${
      user?.level ? Math.round((user.level - Math.floor(user.level)) * 100) : 0
    }%`,
    backgroundColor: 'var(--blue)',
    borderRadius: 'inherit',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
  };

  const labelStyles: CSSProperties = {
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
        <span style={labelStyles}>
          {`${
            user.level
              ? Math.round((user.level - Math.floor(user.level)) * 100)
              : 0
          }%`}
        </span>
      </div>
    </div>
  );
}

export default ProgressBar;
