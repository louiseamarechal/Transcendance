import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ActivityStatus from '../ActivityStatus';
import { useEffect, useState } from 'react';
import { FriendRequest } from '../../types/FriendRequest.type';
import { useUser } from '../../hooks/useUser';

type ActionButtonsProps = {
  activity: string;
  // refresh: boolean;
  // setRefresh: Function;
};

// function ActionButtons({ activity, refresh, setRefresh }: ActionButtonsProps) {
function ActionButtons({ activity }: ActionButtonsProps) {
  const { myId } = useUser();
  const { profileId } = useParams();
  console.log({ profileId });
  const axiosInstance = useAxiosPrivate();
  const [FR, setFR] = useState<FriendRequest | null>();
  const [blockedBy, setBlockedBy] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);
  console.log(`blocked: ${blocked}, blockedBy: ${blockedBy}`);
  console.log({ FR });

  useEffect(() => {
    axiosInstance.get(`user/blockedBy/${profileId}`).then((res) => {
      if (res.data) setBlockedBy(true);
    });
    axiosInstance.get('user/blocked').then((res) => {
      const blockedId: number[] = res.data;
      console.log({ blockedId });
      if (!profileId) return;
      setBlocked(blockedId.includes(parseInt(profileId)));
    });
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`friend-request/with/${profileId}`)
      .then((res) => {
        if (res.data.length > 0) {
          setFR(res.data[0]);
          console.log('data[0].fromId pour voir', res.data[0].fromId);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleAddFriend() {
    axiosInstance
      .post(`friend-request/${profileId}`, {})
      .then((response) => {
        console.log(response.data);
        setFR(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleAcceptFriend() {
    if (!FR) return;
    axiosInstance
      .patch(`friend-request/${FR.id}`, { status: 'ACCEPTED' })
      .then((response) => {
        console.log(response.data);
        setFR(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleRemoveFR() {
    if (!FR) return;
    axiosInstance.delete(`friend-request/${FR.id}`).then(() => {
      setFR(null);
    });
  }

  function handleBlockUser() {
    axiosInstance
      .post(`user/block/${profileId}`)
      .then(() => {
        setBlocked(true);
        if (!FR) return;
        setFR({ ...FR, status: 'REFUSED' });
      })
      .catch((err) => {
        if (err.response.status === 409) {
          alert(err.response.data);
        }
      });
  }

  function handleUnblockUser() {
    axiosInstance.delete(`user/block/${profileId}`).then(() => {
      setBlocked(false);
      if (!FR) return;
      setFR({ ...FR, status: 'ACCEPTED' });
    });
  }

  if (!FR) {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleAddFriend();
          }}
        >
          Add friend
        </button>
      </div>
    );
  } else if (FR.status === 'REFUSED') {
    if (blocked) {
      return (
        <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
          <button
            className="small-button friend-request-button"
            onClick={handleUnblockUser}
          >
            Unblock
          </button>
        </div>
      );
    } else if (blockedBy) {
      return (
        <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
          <button className="small-button">
            Blocked
          </button>
        </div>
      );
    }
  } else if (FR.status === 'ACCEPTED') {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleRemoveFR();
          }}
        >
          Remove Friend
        </button>
        <button
          className="small-button friend-request-button"
          onClick={handleBlockUser}
        >
          Block
        </button>
        <ActivityStatus activity={activity} />
      </div>
    );
  } else if (FR.fromId === myId && FR.status === 'PENDING') {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button className="small-button friend-request-button">Pending</button>
      </div>
    );
  } else if (FR.toId === myId && FR.status === 'PENDING') {
    return (
      <div className="flex flex-col gap-2 justify-end w-[55%] items-end">
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleAcceptFriend();
          }}
        >
          Accept
        </button>
        <button
          className="small-button friend-request-button"
          onClick={() => {
            handleRemoveFR();
          }}
        >
          Decline
        </button>
      </div>
    );
  }
}

export default ActionButtons;
