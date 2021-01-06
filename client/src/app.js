//main app component
// children:
// 1: profilePic.js
// 2: uploader.js
// 3: logo component (optional)

// app class component
// render Profile pic and Uploader
// store in state-> data about user
// data = everything except the password;
// passes the data (props) to every child component that might need it
// toggle the modal (for uploading)

import { Component } from "react";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderVisible: false,
        };
    }

    componentDidMount() {
        console.log("app mounted!");
        // use axios to make request to server
        // the server will have to retrieve info about user
        // info we need: everything except the password
        // once we get a response from axios, store data in state of app
    }

    toggleUploader() {
        // console.log("toggle uploader is running!");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }
    //you can call these functions from other components (uploader, profilepic)
    setImage(newProfilePic) {
        console.log("newProfilepic:", newProfilePic);
        this.setState({
            url: "whatever the new profile pic is",
        });
    }

    render() {
        return (
            <div>
                <h1>App</h1>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.url}
                />
                <p onClick={() => this.toggleUploader()}>
                    Upload new profilepic
                </p>
                {this.state.uploaderVisible && (
                    <Uploader setImage={() => this.setImage} />
                )}
            </div>
        );
    }
}
