import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

import { reducer } from "./reducer";
import Welcome from "./welcome";
import App from "./app";
import { init } from "./socket";

let elem;

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    //connects socket with redux:
    init(store);
    
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
