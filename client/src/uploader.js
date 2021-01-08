
import axios from "./axios";
import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: {},
        };
    }

    handleClick() {
        const formData = new FormData();
        formData.append("image", this.state.image);
        console.log("props in uploader", formData);
        axios
            .post("/upload", formData)
            .then((res) => this.props.setImage(res.data.url))
            .then(() => this.props.toggleUploader())
            .catch((err) => console.log("error in imageupload", err));
    }

    handleChange(e) {
        this.setState(
            {
                image: e.target.files[0],
            },
            () => console.log("this.state in handleChange:", e.target.files[0])
        );
    }

    render() {
        return (
            <div>
                <div className="modalContainer">
                    <div className="popupModal">
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="image"
                            type="file"
                            accept="image/*"
                        ></input>
                        <button onClick={() => this.handleClick()}>
                            upload!
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
