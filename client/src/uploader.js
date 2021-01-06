//child of app

// is the "click here to upload a profile pic" modal
// takes image that user selected + sends it off to server
// let's App know there's a new profile picture (update app state)

import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    /* 
        Uploader has three jobs:
        1. store the image the user selected in its own state // imageboard
        2. send file to server // imageboard
        3. let app know there is a new profile picture, and that app needs to update its own state

    */

    handleClick() {
        console.log("props in uploader", this.props);
        this.props.setImage("uploader click event!");
        // updates state of app;
    }

    render() {
        return (
            <div>
                <h1 onClick={() => this.handleClick()}>Uploader!</h1>
            </div>
        );
    }
}
