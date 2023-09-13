import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicUser } from '../../../../../../../../../shared/common/types/user.type';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

function GameRequestButton({ user }: { user: PublicUser }) {
  async function sendGameRequest() {}

  return (
    <div
      className="option-button"
      onClick={() => {
        sendGameRequest();
        /*navigate somewhere ?*/
      }}
    >
      <FontAwesomeIcon icon={faGamepad} style={{ color: 'blue' }} />
    </div>
  );
}

export default GameRequestButton;
