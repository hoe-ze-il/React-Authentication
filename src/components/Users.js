import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get("/users", {
                    signal: controller.signal,
                });
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate("/login", {
                    state: { from: location },
                    replace: true,
                });
            } finally {
                isMounted && setLoading(false);
            }
        };

        getUsers();

        return () => {
            isMounted = false;
            isMounted && controller.abort();
        };
    }, [axiosPrivate, navigate, location]); // Include dependencies

    return (
        <article>
            <h2>Users List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : users.length ? (
                <ul>
                    {users.map((user, i) => (
                        <li key={i}>{user?.username}</li>
                    ))}
                </ul>
            ) : (
                <p>No users to display</p>
            )}
        </article>
    );
};

export default Users;
