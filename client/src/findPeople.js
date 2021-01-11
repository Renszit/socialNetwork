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
                    console.log("data from get request findPeople", data);
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
                <h1>find users.</h1>
                <input
                    type="text"
                    onChange={(e) => findPerson(e.target.value)}
                    placeholder="type name here"
                />
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
                                    <img className="" src={user.url}></img>
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
