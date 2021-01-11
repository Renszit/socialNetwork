import axios from "./axios";
import { Component } from "react";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Link, Route } from "react-router-dom";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderVisible: false,
            url: "",
        };
    }

    checkDefault() {
        if (this.state.url == null) {
            this.setState({
                url: "./missing-profile-photo.jpeg",
            });
        }
    }

    componentDidMount() {
        console.log("app mounted!");
        axios
            .get("/profile")
            .then((res) => {
                // console.log(res.data);
                this.setState(res.data);
            })
            .then(() => this.checkDefault())
            .catch((err) => console.log("error in profile axios", err));
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    setImage(newProfilePic) {
        this.setState({
            url: newProfilePic,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    logout() {
        axios.get("/logout").then(() => location.replace("/welcome"));
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <header>
                        <p className="pTags">
                            community for a future unreality
                        </p>
                        <Link to={"/users"}>
                            <p>find users</p>
                        </Link>

                        <p onClick={this.logout}>logout</p>

                        <div className="profilePicContainer">
                            <ProfilePic
                                toggleUploader={() => this.toggleUploader()}
                                first={this.state.first}
                                last={this.state.last}
                                url={this.state.url}
                            />
                        </div>
                    </header>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                toggleUploader={() => this.toggleUploader()}
                                first={this.state.first}
                                last={this.state.last}
                                url={this.state.url}
                                bio={this.state.bio}
                                setBio={(newBio) => this.setBio(newBio)}
                            />
                        )}
                    />

                    <Route exact path="/users" render={() => <FindPeople />} />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />

                    {this.state.uploaderVisible && (
                        <Uploader
                            toggleUploader={() => this.toggleUploader()}
                            setImage={(newProfilePic) =>
                                this.setImage(newProfilePic)
                            }
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
