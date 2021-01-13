import { Component } from "react";
import axios from "./axios";
import AddAsFriend from "./addAsFriend";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios.get("/profile").then((res) => {
            // console.log("res data id:", res.data.id);
            if (this.props.match.params.id == res.data.id) {
                this.props.history.push("/");
            } else {
                axios
                    .get("/app/user/" + this.props.match.params.id)
                    .then((res) => {
                        // console.log("res.data! 2nd axxios;", res.data);
                        if (res.data && !res.data.error) {
                            console.log(res.data);
                            this.setState(res.data);
                        } else {
                            this.props.history.push("/");
                        }
                    })
                    .catch((err) =>
                        console.log("Otherprofile mounted ERROR:", err)
                    );
            }
        });
    }

    render() {
        return (
            <div>
                <div className="otherProfileContainer">
                    {this.state.url && <img src={this.state.url}></img>}
                    {!this.state.url && (
                        <img src="/missing-profile-photo.jpeg"></img>
                    )}
                    <div className="otherTitle">
                        <h1>
                            {this.state.first} {this.state.last}
                        </h1>
                        <p>{this.state.bio}</p>
                        <AddAsFriend otherUserId={this.props.match.params.id} />
                    </div>
                </div>
            </div>
        );
    }
}
