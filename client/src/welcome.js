// function component
// import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <div className="largeLogoContainer">
                <img
                    className="logoLarge"
                    src="Surrealism_logo_large.svg"
                ></img>
                <p>community for the unconcious mind</p>
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
