import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <img className="logoSmall" src="Surrealism_logo_smol.svg"></img>;
}

ReactDOM.render(elem, document.querySelector("main"));
