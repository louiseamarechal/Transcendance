// import React from "react";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.tsx";
import { ProfilStat } from "../components/ProfilStat.tsx";
import ProgressBar from "../components/ProgressBar.tsx";
import UserCard from "../components/UserCard.tsx";
import "../style/pages/Profil.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate.ts";
import { User } from "../types/User.type.ts";

function Profil() {
  // Profil page will depend on the user id => see later on
  const axiosInstance = useAxiosPrivate();
  const [user, setUser] = useState<User>({});
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axiosInstance
      .get("user/me")
      .then((res) => {
        setUser(res.data);
        setLoading(false)
      })
      .catch((e) => console.log(e));
    console.log({ user });
  }, []);

  if (isLoading) {
    return <div className="grid place-items-center h-screen">Loading...</div>
  }

  return (
    <div className="h-screen">
      {/* <NavBar /> */}
      {/* <div className="profil-container content-center"> */}
      <div className="grid grid-cols-1 place-items-center">
        <div className="m-10"></div>
        <UserCard user={user} />
        <ProgressBar user={user}/>
        <ProfilStat user={user}/>
      </div>
    </div>
  );
}

export default Profil;
