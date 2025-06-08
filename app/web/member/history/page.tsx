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
                console.log(orders);
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
        </>
    )
}