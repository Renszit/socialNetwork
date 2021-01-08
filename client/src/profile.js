import BioEditor from "./bioEditor";
import ProfilePic from "./profilePic";

export default function Profile(props) {
    // console.log("properties app profile", props);
    const { first, last, url, bio, setBio, toggleUploader } = props;
    return (
        <div>
            <div className="profileContainer">
                <h3>
                    Hi {first} {last}, welcome to this space
                </h3>
                <p> {bio}</p>
                <BioEditor setBio={setBio} bio={bio} />
                <div className="bioPicContainer">
                    <ProfilePic url={url} toggleUploader={toggleUploader} />
                </div>
            </div>
        </div>
    );
}
