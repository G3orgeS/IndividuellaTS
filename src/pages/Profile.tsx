import '../css/Profile.css'
import programmerGif from '../auth/test/do-not-touch-it-programmer.gif';

function Profile() {
    return (
        <div className="center">
            <img src={programmerGif} alt="En bild som beskriver programmering i ett nötskal" />
        </div>
    )
}

export default Profile