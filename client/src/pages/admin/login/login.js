import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";

import styles from './login.module.css';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const notify = (error) => toast.info(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    async function handleLogin(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post("/admin/login", {
                email,
                password
            });
            console.log(response, "resp");

            if (response.status === 200) {
                notify("Login successful");
                navigate('/admin')
            }
        } catch (error) {
            console.error(error);
            notify(error.response?.data?.message || error.message);
        }
    }

    return (
        <div className={styles.adminLoginmain}>
            <div className={styles.adminLoginsubmain}>
                <h1>#Admin Login</h1>
                <div className={styles.adminLoginfeildmain}>
                    <form onSubmit={handleLogin}>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                                required
                            />
                        </div>
                        <button>Login</button>
                        <ToastContainer />
                    </form>
                </div>
            </div>
        </div>
    );
}
