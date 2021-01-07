import BioEditor from "./bioEditor";
import ProfilePic from "./profilePic";

export default function Profile(props) {
    // console.log("properties app profile", props);
    const { first, last, url, bio, setBio, toggleUploader } = props;
    return (
        <div>
            <div className="profileContainer">
                <h3>Hi {first}, here you can change your bio!</h3>
                <h3>Bio:</h3>
                <p>
                    {first} {last}:
                </p>
                <p>{bio}</p>
                <ProfilePic url={url} toggleUploader={toggleUploader} />
                <BioEditor setBio={setBio} bio={bio} />
            </div>
        </div>
    );
}
