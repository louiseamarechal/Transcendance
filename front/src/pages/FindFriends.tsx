
import NavBar from '../components/NavBar.tsx';
import '../style/pages/FindFriends.css'
import UserCard from '../components/UserCard.tsx';


function FindFriends() {

    return (
        <>
            <NavBar/>
            <div className="findfriends-container friend-card"> 
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
               <div className="friend-card" ><UserCard /> </div>
                </div>            
        </>
    )
}

export default FindFriends;