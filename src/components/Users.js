import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const Users = () => {
    const [nombres, setName] = useState("");
    const [apellidos, setLastName] = useState("");
    const [tipo_documento, setTypeDocument] = useState("");
    const [documento, setDocument] = useState("");
    const [email, setEmail] = useState("");
    const [hobbie, setHobbie] = useState("");

    const [editing, setEditing] = useState(false);
    const [id, setId] = useState("");

    const nameInput = useRef(null);

    let [users, setUsers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editing) {
            const res = await fetch(`${API}/api/personas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombres,
                    apellidos,
                    tipo_documento,
                    documento,
                    email,
                    hobbie,
                }),
            });
            await res.json();
        } else {
            const res = await fetch(`${API}/api/personas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombres,
                    apellidos,
                    tipo_documento,
                    documento,
                    email,
                    hobbie,
                }),
            });
            const data = await res.json();
            console.log(data);
            setEditing(false);
            setId("");
        }
        await getUsers();

        setName("");
        setLastName("");
        setTypeDocument("");
        setDocument("");
        setEmail("");
        setHobbie("");
        nameInput.current.focus();
    };

    const getUsers = async () => {
        const res = await fetch(`${API}/api/personas`);
        const data = await res.json();
        setUsers(data);
    };

    const deleteUser = async (id) => {
        const userResponse = window.confirm("Esta seguro de querer eliminarlo?");
        if (userResponse) {
            const res = await fetch(`${API}/api/personas/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            console.log(data);
            await getUsers();
        }
    };

    const editUser = async (id) => {
        const res = await fetch(`${API}/api/personas/${id}`);
        const data = await res.json();

        setEditing(true);
        setId(id);

        // Reset
        setName(data.nombres);
        setLastName(data.apellidos);
        setTypeDocument(data.tipo_documento);
        setDocument(data.documento);
        setEmail(data.email);
        setHobbie(data.hobbie);
        nameInput.current.focus();
        console.log(data)
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={nombres}
                            className="form-control"
                            placeholder="Name"
                            ref={nameInput}
                            autoFocus
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            value={apellidos}
                            className="form-control"
                            placeholder="LastName"
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => setTypeDocument(e.target.value)}
                            value={tipo_documento}
                            className="form-control"
                            placeholder="TypeDocument"
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => setDocument(e.target.value)}
                            value={documento}
                            className="form-control"
                            placeholder="Document"
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="form-control"
                            placeholder="User's Email"
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(e) => setHobbie(e.target.value)}
                            value={hobbie}
                            className="form-control"
                            placeholder="Hobbie"
                        />
                    </div>
                    <br />
                    <button className="btn btn-primary btn-block">
                        {editing ? "Update" : "Create"}
                    </button>
                </form>
            </div>
            <div className="col-md-6">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Documento</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.nombres}</td>
                                <td>{user.email}</td>
                                <td>{user.documento}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary btn-sm btn-block"
                                        onClick={(e) => editUser(user.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm btn-block"
                                        onClick={(e) => deleteUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};