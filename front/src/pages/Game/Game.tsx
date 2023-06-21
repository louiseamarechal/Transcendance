import useAxiosPrivate from "../hooks/useAxiosPrivate.ts";
import '../style/components/net.css'
import '../style/components/buttons.css'
import '../style/pages/Game.css'
import { Link } from 'react-router-dom';


function Game() {

  const axiosPrivate = useAxiosPrivate();

  const getUser = async () => {
    const reponse = await axiosPrivate.get('/user/me');
    console.log(reponse);
  };  
  return (
      <>
        {/* <NavBar /> */}
        {/* <button onClick={() => getUser()}>User</button> */}
        <div className="gamepage-container">
          <h1 className="gamepage-title">PONG</h1>
          <div className="net-container">
            <div className="net"></div>
            <Link to={'/wait'} >
            <button className="searchgame-button mr-2"style={{ marginRight: '40%' }}>Search Game</button>
            </Link>
            <Link to={'/findfriends'} >
            <button className="searchgame-button m1-2"style={{ marginLeft: '40%' }}>Invite Friends</button>
            </Link>
          <div className="net w-100px mb-4"></div>
          </div>
        </div>
        {/* </div> */}
      </>
    );
  }
  
  export default Game;
  

