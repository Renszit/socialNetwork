import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("this.props.match", this.props.match.params.id);
        //to get access to the id ( for rendering the correct profile )
        // if we are viewing our own profile, we should make sure to send the user back to the '/' route

        // //"32" = the userId
        if (this.props.match.params.id == this.props.id) {
            this.props.history.push("/");
        }
    }

    //axios request to get that specific's information
    //don't make that request to user/id// change it in server to user/:id.json
    render() {
        return (
            <div>
                <h1>Other profile component</h1>
            </div>
        );
    }
}
