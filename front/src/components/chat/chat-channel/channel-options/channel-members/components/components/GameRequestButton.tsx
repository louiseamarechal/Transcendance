import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicUser } from '../../../../../../../../../shared/common/types/user.type';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../../../../../../hooks/useAxiosPrivate';

function GameRequestButton({ user }: { user: PublicUser }) {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  async function sendGameRequest() {
    let friends: PublicUser[] = [];

    await axiosPrivate
      .get('friend-request/my-friends')
      .then((res) => {
        friends = res.data;
      })
      .catch(() => {
        console.log('Opsi in GameRequestButton');
      });

    for (const friend of friends) {
      if (friend.id === user.id) {
        navigate(`/game/create?friend=${user.id}&name=${user.name}`);
        return;
      }
    }

    alert('Not your friend sorry');
  }

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
