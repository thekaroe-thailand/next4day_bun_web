'use client'

import { useState } from "react"
import Swal from "sweetalert2";
import axios from "axios";
import { Config } from "@/app/config";
import { useRouter } from "next/navigation";
import { ErrorInterface } from "@/app/interface/ErrorInterface";

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const url = Config.apiUrl + '/api/admin/signin';
            const payload = {
                username: username,
                password: password
            }
            const result = await axios.post(url, payload);

            if (result.data.token != null) {
                localStorage.setItem(Config.tokenName, result.data.token);

                const level = result.data.level;

                if (level === 'admin') {
                    router.push('/backoffice/home/dashboard');
                } else if (level === 'user') {
                    router.push('/backoffice/home/order');
                }
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    return (
        <div className="signin-block">
            <div className="signin">
                <h1>Sign In to BackOffice</h1>
                <div>
                    <div>username</div>
                    <input onChange={e => setUsername(e.target.value)} />
                </div>
                <div>
                    <div>password</div>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <button type="submit" onClick={handleSignIn}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}