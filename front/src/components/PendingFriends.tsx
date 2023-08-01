import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { User } from '../types/User.type';

const PendingFriends = () => {
  const [pendingFR, setPendingFR] = useState<User[]>([]);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getPendingFR = async () => {
      await axiosPrivate
        .get('user/pending-request')
        .then((res) => {
          res.data.map((re: any) => {
            console.log(re.fromId);
            // setUserId((previous) => {
            //     return ([...previous, re.fromId])
            // });
            axiosPrivate.get(`user/${re.fromId}`).then((res) => {
              console.log(res);
              setPendingFR((previous) => {
                [...previous, res];
              });
            });
          });
        })
        .catch((err) => {
          console.log({ err: err.response });
        });
    };
    getPendingFR();
  }, []);
  return (
    <div>
      {/* <h2>Pending Friend Requests : </h2>
      {pendingFR.map((fr) => {
        return <p>{fr}</p>;
      })} */}
    </div>
  );
};

export default PendingFriends;
