'use client'

import { useState } from "react"
import { Config } from "@/app/config"
import axios from "axios"
import Swal from "sweetalert2"
import { ErrorInterface } from "@/app/interface/ErrorInterface"

export default function Register() {
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    title: 'ตรวจสอบรหัสผ่าน',
                    text: 'โปรดกรอกให้ตรงกัน',
                    icon: 'warning'
                })
                return
            }

            const url = Config.apiUrl + '/api/member/signup'
            const payload = {
                phone: phone,
                username: username,
                password: password
            }
            const response = await axios.post(url, payload);

            if (response.status == 200) {
                Swal.fire({
                    title: 'บันทึกข้อมูล',
                    text: 'บันทึกข้อมูลสำเร็จ',
                    icon: 'success',
                    timer: 1000
                })
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'Error ' + (err as ErrorInterface).message
            })
        }
    }

    return (
        <div className="front">
            <div className="text-xl">สมัครสมาชิก</div>
            <form onSubmit={(e) => handleSignUp(e)}>
                <div>
                    <label>เบอร์โทร</label>
                    <input onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <label>username</label>
                    <input onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label>ยืนยัน password</label>
                    <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <button type="submit">
                        <i className="fa fa-check mr-2"></i>
                        ส่งข้อมูลการสมัคร
                    </button>
                </div>
            </form>
        </div>
    )
}