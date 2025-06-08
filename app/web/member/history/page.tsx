'use client'

import { Config } from "@/app/config";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { OrderInterface } from "@/app/interface/OrderInterface"
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

export default function History() {
    const [orders, setOrders] = useState<OrderInterface[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/member/history';
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenMember)
            };
            const response = await axios.get(url, { headers });

            if (response.status === 200) {
                const rows = [];

                for (let i = 0; i < response.data.length; i++) {
                    const order = response.data[i];

                    let sum = 0;

                    for (let j = 0; j < order.OrderDetail.length; j++) {
                        const orderDetail = order.OrderDetail[j];
                        const price = orderDetail.price;
                        const qty = orderDetail.qty;
                        const amount = (qty * price);

                        orderDetail.amount = amount;

                        sum += amount;
                    }

                    order.sum = sum;

                    rows.push(order);
                }

                setOrders(rows);
            }
        } catch (err: unknown) {
            const error = err as ErrorInterface;
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: error.message
            })
        }
    }

    return (
        <>
            <div className="text-2xl mb-3">
                <i className="fa fa-file-alt mr-2"></i>
                ติดตามสินค้า
            </div>

            {orders.map((order) => (
                <div key={order.id} className="border mb-5 p-3 rounded-lg shadow-md bg-white">
                    <div className="flex">
                        <div className="w-[150px]">วันที่สั่งซื้อ</div>
                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[150px]">ชื่อผู้รับสินค้า</div>
                        <div>{order.customerName}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[150px]">ที่อยู่ในการจัดส่ง</div>
                        <div>{order.customerAddress}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[150px]">เบอร์โทร</div>
                        <div>{order.customerPhone}</div>
                    </div>
                    <div className="flex">
                        <div className="w-[150px]">รหัสติดตามพัสดุ</div>
                        <div>{order.trackCode} {order.express}</div>
                    </div>

                    <div className="font-semibold mt-3">
                        <i className="fa fa-file mr-2"></i>
                        รายการสินค้า
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>รหัสสินค้า</th>
                                <th>ชื่อสินค้า</th>
                                <th className="text-right">ราคา</th>
                                <th className="text-right">จำนวน</th>
                                <th className="text-right">ยอดรวม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.OrderDetail.map((orderDetail) =>
                                <tr key={orderDetail.id}>
                                    <td>{orderDetail.Book.isbn}</td>
                                    <td>{orderDetail.Book.name}</td>
                                    <td className="text-right">{orderDetail.price.toLocaleString()}</td>
                                    <td className="text-right">{orderDetail.qty}</td>
                                    <td className="text-right">{orderDetail.amount.toLocaleString()}</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4} className="p-3"></td>
                                <td className="text-right p-3 bg-gray-400 rounded-br-xl rounded-bl-xl">
                                    {order.sum.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            ))}
        </>
    )
}