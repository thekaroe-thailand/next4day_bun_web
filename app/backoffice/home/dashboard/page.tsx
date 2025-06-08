'use client'

import { Config } from "@/app/config";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

export default function Dashboard() {
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalMember, setTotalMember] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/dashboard/list';
            const token = localStorage.getItem(Config.tokenName);
            const headers = {
                'Authorization': 'Bearer ' + token
            };
            const response = await axios.get(url, { headers });

            if (response.status === 200) {
                setTotalOrder(response.data.totalOrder);
                setTotalIncome(response.data.totalIncome);
                setTotalMember(response.data.totalMember);
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
        <div className="p-5">
            <h1 className="text-2xl">Dashboard</h1>
            <div className="flex gap-4 justify-between">
                <div className="p-5 bg-indigo-500 rounded-xl text-white w-full text-right">
                    <div className="text-lg">
                        รายการสั่งซื้อ
                        <i className="fa fa-shopping-cart ml-2"></i>
                    </div>
                    <div className="text-4xl">{totalOrder.toLocaleString()}</div>
                </div>

                <div className="p-5 bg-green-600 rounded-xl text-white w-full text-right">
                    <div className="text-lg">
                        รายได้
                        <i className="fa fa-dollar-sign ml-2"></i>
                    </div>
                    <div className="text-4xl">{totalIncome.toLocaleString()}</div>
                </div>

                <div className="p-5 bg-amber-500 rounded-xl text-white w-full text-right">
                    <div className="text-lg">
                        สมาชิก
                        <i className="fa fa-user ml-2"></i>
                    </div>
                    <div className="text-4xl">{totalMember.toLocaleString()}</div>
                </div>
            </div>
        </div>
    )
}