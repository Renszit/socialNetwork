//hooks
import axios from "./axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [person, findPerson] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        let abort;
        (async () => {
            if (!person) {
                const { data } = await axios.get("/users/recent");
                if (!abort) {
                    setResults(data);
                }
            } else {
                const { data } = await axios.get("/users/search", {
                    params: { value: person },
                });
                if (!abort) {
                    setResults(data);
                }
            }
        })();
        return () => {
            console.log("about to update the three recent peoples");
            abort = true;
        };
    }, [person]);

    return (
        <div>
            <div className="findPeopleContainer">
                <h1>find.</h1>
                <input
                    type="text"
                    onChange={(e) => findPerson(e.target.value)}
                    placeholder="type name here"
                />
                <img id="lookingGlass" src="./looking_glass.png"></img>
            </div>
            <div className="membersLookupContainer">
                {!person && <p>Latest members:</p>}
                {person && (
                    <p>
                        Results for: <strong>{person}</strong>{" "}
                    </p>
                )}
                <div className="userBlock">
                    {results.map((user, index) => (
                        <div key={index}>
                            <Link to={`/user/${user.id}`}>
                                <div className="searchImgContainer">
                                    {user.url && (
                                        <img className="" src={user.url}></img>
                                    )}
                                    {!user.url && (
                                        <img
                                            className=""
                                            src="./missing-profile-photo.jpeg"
                                        ></img>
                                    )}
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
