// child of app // function component

// Render the profile picture
// Render default image if user does not have profile pic!

export default function ProfilePic(props) {
    const { first, last, url } = props;
    // console.log("props in ProfilePic:", props);
    return (
        <div>
            <h1>
                Welcome {first} {last}!
            </h1>
            <img className="profileImg" src={url}></img>
        </div>
    );
}
