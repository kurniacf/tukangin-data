import React, {Fragment, useState, useEffect} from 'react';
import { toast } from "react-toastify";

const Dashboard = ({setAuth}) => {
    const [name, setName] = useState("");

    async function getName() {
        try {
            const res = await fetch("/dashboard/", 
            {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await res.json();
            setName(parseRes.name);

        } catch (err) {
            console.error(err.message);
        }
    };

    const logout = e => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logout successfully");
    };

    useEffect(() => {
        getName();
    }, []);


    return (
        <Fragment>
            <h1>Dashboard {name}</h1>
            <button onClick={e => logout(e)} className="btn btn-primary">Logout</button>
        </Fragment>
    );
};
export default Dashboard;