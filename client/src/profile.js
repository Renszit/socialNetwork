import BioEditor from "./bioEditor";
import ProfilePic from "./profilePic";

export default function Profile(props) {
    // console.log("properties app profile", props);
    const { first, last, url, bio, setBio, toggleUploader } = props;
    return (
        <div>
            <div className="profileContainer">
                <h3>
                    Hi {first} {last}, this is your Bio:
                </h3>
                <p> {bio}</p>
                <div className="bioPicContainer">
                    <ProfilePic url={url} toggleUploader={toggleUploader} />
                </div>
                <BioEditor setBio={setBio} bio={bio} />
            </div>
        </div>
    );
}
