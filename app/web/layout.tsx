// app/web/layout.tsx

'use client'

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Config } from "../config";
import axios from "axios";
import { ErrorInterface } from "../interface/ErrorInterface";

export default function WebLayout({
    children
}: {
    children: React.ReactNode
}) {
    const [username, setUsername] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem(Config.tokenMember);

            if (token != undefined) {
                const headers = {
                    'Authorization': 'Bearer ' + token
                }
                const url = Config.apiUrl + '/api/member/info'
                const response = await axios.get(url, { headers })

                if (response.status == 200) {
                    setUsername(response.data.username);
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

    useEffect(() => {
        fetchData();
    }, [])

    const handleSignOut = async () => {
        const button = await Swal.fire({
            title: 'ออกจากระบบ',
            text: 'คุณต้องการออกจากระบบใช่ไหม ?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })

        if (button.isConfirmed) {
            localStorage.removeItem(Config.tokenMember);
            window.location.href = '/web'
        }
    }

    return (
        <>
            <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-700 p-10 text-white">
                <div className="flex justify-between">
                    <div>
                        <div className="text-3xl">
                            <i className="fa fa-book-open mr-3"></i>
                            KobBook ร้านหนังสือออนไลน์
                        </div>
                        <div className="text-xl">แหล่งความรุ้ใกล้บ้านคุณ</div>
                    </div>
                    <div>
                        {username != '' ?
                            <>
                                <i className="fa fa-user mr-2"></i>
                                {username}
                            </> : null
                        }
                    </div>
                </div>
            </div>

            <div className="bg-gray-700 text-white p-4 flex gap-4">
                <Link href='/web'>
                    <i className="fa fa-home mr-2"></i>
                    หน้าแรก
                </Link>
                {username == ''
                    ?
                    <>
                        <Link href='/web/member/register'>
                            <i className="fa fa-user-plus mr-2"></i>
                            สมัครสมาชิก
                        </Link>
                        <Link href='/web/member/sign-in'>
                            <i className="fa fa-lock mr-2"></i>
                            เข้าสู่ระบบ
                        </Link>
                    </>
                    :
                    <>
                        <Link href='/web/member/history'>
                            <i className="fa fa-file-alt mr-2"></i>
                            ติดตามสินค้า
                        </Link>
                        <button onClick={handleSignOut}>
                            <i className="fa fa-times mr-2"></i>
                            ออกจากระบบ
                        </button>
                    </>
                }
            </div>

            <div className="p-4">
                {children}
            </div>
        </>
    )
}