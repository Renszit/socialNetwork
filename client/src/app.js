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

import axios from "./axios";
import { Component } from "react";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderVisible: false,
            url: "",
        };
    }

    componentDidMount() {
        console.log("app mounted!");
        axios
            .get("/profile")
            .then((res) => {
                console.log("response profile get route:", res.data);
                this.setState(res.data);
            })
            .catch((err) => console.log("error in profile axios", err));
    }

    toggleUploader() {
        // console.log("toggle uploader is running!");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    setImage(newProfilePic) {
        console.log("newProfilepic:", newProfilePic);
        this.setState({
            url: newProfilePic,
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
                    <Uploader
                        setImage={(newProfilePic) =>
                            this.setImage(newProfilePic)
                        }
                    />
                )}
            </div>
        );
    }
}
