// child of app // function component

export default function ProfilePic(props) {
    const { first, url, toggleUploader } = props;
    // console.log("props in ProfilePic:", props);
    return (
        <div>
            <img
                onClick={toggleUploader}
                className="profileImg"
                src={url}
                alt={first}
            ></img>
        </div>
    );
}
