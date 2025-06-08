'use client'

import { Config } from "@/app/config";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

export default function EditProfile() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    title: 'ตรวจสอบรหัสผ่าน และการยืนยัน',
                    text: 'รหัสผ่่านไม่ตรงกัน',
                    icon: 'warning'
                })
                return
            }

            const url = Config.apiUrl + '/api/admin/update';
            const payload = {
                name: name,
                username: username,
                password: password
            }
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenName)
            }
            const response = await axios.put(url, payload, { headers })

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
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/admin/info';
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenName)
            }
            const response = await axios.get(url, { headers });

            if (response.status == 200) {
                setName(response.data.name);
                setUsername(response.data.username);
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
        <div className="container">
            <div className="title">แก้ไขข้อมูลส่วนต้ว</div>
            <div>
                <label>ชื่อ</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>password *หากไม่ต้องการแก้ไข ไม่ต้องกรอก</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>confirm password *หากไม่ต้องการแก้ไข ไม่ต้องกรอก</label>
                <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div>
                <button onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>
                    Save
                </button>
            </div>
        </div>
    )
}