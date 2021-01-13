// child of app // function component

export default function ProfilePic(props) {
    const { first, url, toggleUploader } = props;
    return (
        <div>
            <img onClick={toggleUploader} src={url} alt={first}></img>
        </div>
    );
}
