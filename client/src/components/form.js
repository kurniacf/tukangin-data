import React, {Fragment, useState} from 'react';
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

const Formm = ({setAuth}) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        handphone: "",
        avatar: ""
    });
    const { email, password, name, handphone, avatar } = inputs;

    const onChange = e => setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { email, password, name, handphone, avatar };
            const response = await fetch(
                "http://localhost:5000/form",
                {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(body)
                }
            );
            const parseRes = await response.json();

            if(parseRes.token){
                //localStorage.setItem("token", parseRes.token);
                setAuth(true);
                toast.success("Form Successfully");
            } else {
                setAuth(false);
                toast.error(parseRes);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <h1 className="mt-5 text-center">Form</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={e => onChange(e)}
                    className="form-control my-3"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)}
                    className="form-control my-3"
                />
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => onChange(e)}
                    className="form-control my-3"
                />
                <input
                    type="text"
                    name="handphone"
                    value={handphone}
                    onChange={e => onChange(e)}
                    className="form-control my-3"
                />
                <input
                    type="file"
                    name="avatar"
                    value={avatar}
                    onChange={e => onChange(e)}
                    className="form-control my-3"
                />
            <button class="btn btn-success btn-block">Submit</button>
            </form>
            <Link to="/form">Form</Link>
        </Fragment>
    );
};
export default Formm;