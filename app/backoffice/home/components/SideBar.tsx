'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import axios from "axios";
import { Config } from "@/app/config";
import { useRouter } from "next/navigation";
import { ErrorInterface } from "@/app/interface/ErrorInterface";

export default function Sidebar() {
    const [name, setName] = useState('');
    const [level, setLevel] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/admin/info';
            const token = localStorage.getItem(Config.tokenName);

            if (!token) {
                router.push('/backoffice/signin');
            } else {
                const headers = {
                    'Authorization': 'Bearer ' + token
                }
                const res = await axios.get(url, { headers });

                if (res.data.name !== undefined) {
                    setName(res.data.name);
                    setLevel(res.data.level);
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

    const handleSignOut = async () => {
        const button = await Swal.fire({
            text: 'คุณต้องการออกจากระบบใช่หรือไม่',
            title: 'ออกจากระบบ',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        });

        if (button.isConfirmed) {
            localStorage.removeItem(Config.tokenName);
            router.push('/backoffice/signin')
        }
    }

    return (
        <>
            <div className="sidebar">
                <div className="header">
                    <h1>BackOffice</h1>
                    <p>
                        <i className="fa fa-user mr-2"></i>
                        {name}: {level}
                    </p>
                    <p className="button">
                        <Link href="/backoffice/home/edit-profile">
                            <i className="fa fa-user-edit mr-2"></i>
                            แก้ไข
                        </Link>
                        <button onClick={handleSignOut}>
                            <i className="fa fa-times mr-2"></i>
                            ออกจากระบบ
                        </button>
                    </p>
                </div>
                <div className="body">
                    {level === 'admin' &&
                        <Link href="/backoffice/home/dashboard">
                            <i className="fa fa-chart-line"></i>
                            Dashboard
                        </Link>
                    }
                    <Link href="/backoffice/home/book">
                        <i className="fa fa-box"></i>
                        หนังสือ
                    </Link>
                    <Link href="/backoffice/home/order">
                        <i className="fa fa-file"></i>
                        รายการสั่งซื้อ
                    </Link>
                    {level === 'admin' &&
                        <Link href="/backoffice/home/admin">
                            <i className="fa fa-user-cog"></i>
                            ผู้ใช้งานระบบ
                        </Link>
                    }
                </div>
            </div>
        </>
    )
}