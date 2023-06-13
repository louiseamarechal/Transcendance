
import NavBar from '../components/NavBar.tsx';
import FriendProfil from '../components/FriendProfil.tsx';
import '../style/pages/FindFriends.css'


function FindFriends() {

    return (
        <>
            <NavBar/>
            <div className="findfriends-container"> 
                {/* <div className="findfriendtab"> */}
                    <FriendProfil/>
                    <FriendProfil/>
                    <FriendProfil/>
               {/* </div> */}
                </div>            
        </>
    )
}

export default FindFriends;