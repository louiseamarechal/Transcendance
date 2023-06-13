import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import friendprofil from "../style/components/friendprofil.css"

const FriendProfil = () =>
{
    return (
    <div className="friendprofil">  
    <FontAwesomeIcon icon={faUser} className="fa-sharp"  />
    </div>
    )
    
}


export default FriendProfil;