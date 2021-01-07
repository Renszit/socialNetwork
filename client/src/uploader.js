//child of app

// is the "click here to upload a profile pic" modal
// takes image that user selected + sends it off to server
// let's App know there's a new profile picture (update app state)
import axios from "./axios";
import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: {},
        };
    }
    /* 
        Uploader has three jobs:
        1. store the image the user selected in its own state // imageboard
        2. send file to server // imageboard
        3. let app know there is a new profile picture, and that app needs to update its own state
    */

    handleClick() {
        const formData = new FormData();
        formData.append("image", this.state.image);
        console.log("props in uploader", formData);
        axios
            .post("/upload", formData)
            .then((res) => this.props.setImage(res.data.url))
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
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="image"
                    type="file"
                    accept="image/*"
                ></input>
                <button onClick={() => this.handleClick()}>upload!</button>
            </div>
        );
    }
}
