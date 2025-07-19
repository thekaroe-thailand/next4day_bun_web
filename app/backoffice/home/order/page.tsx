'use client'

import { Config } from "@/app/config";
import { OrderInterface } from "@/app/interface/OrderInterface"
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import Image from "next/image";

export default function Order() {
    const [orders, setOrders] = useState<OrderInterface[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [order, setOrder] = useState<OrderInterface>();
    const [traceCode, setTraceCode] = useState('');
    const [express, setExpress] = useState('');
    const [remark, setRemark] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/order/list';
            const token = localStorage.getItem(Config.tokenName);
            const headers = {
                'Authorization': 'Bearer ' + token
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

                    if (order.status === 'cancel') {
                        order.statusText = 'ยกเลิก';
                    } else if (order.status === 'paid') {
                        order.statusText = 'ได้รับเงินแล้ว';
                    } else if (order.status === 'send') {
                        order.statusText = 'จัดส่งแล้ว';
                    }

                    rows.push(order);
                }

                setOrders(rows);
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: (err as ErrorInterface).message
            })
        }
    }

    const openModal = (order: OrderInterface) => {
        setShowModal(true);
        setOrder(order);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleCancel = async () => {
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการยกเลิก',
                icon: 'question',
                text: 'คุณต้องการยกเลิกใช่หรือไม่',
                showConfirmButton: true,
                showCancelButton: true
            });

            if (button.isConfirmed) {
                const url = Config.apiUrl + '/api/order/cancel/' + order?.id;
                const token = localStorage.getItem(Config.tokenName);
                const headers = {
                    'Authorization': 'Bearer ' + token
                };
                const response = await axios.delete(url, { headers });

                if (response.status === 200) {
                    closeModal();
                    fetchData();
                }
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: (err as ErrorInterface).message
            })
        }
    }

    const handlePaid = async () => {
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการชำระเงิน',
                icon: 'question',
                text: 'ตรวจสอบแล้วได้รับเงินจริง',
                showConfirmButton: true,
                showCancelButton: true
            });

            if (button.isConfirmed) {
                const url = Config.apiUrl + '/api/order/paid/' + order?.id;
                const token = localStorage.getItem(Config.tokenName);
                const headers = {
                    'Authorization': 'Bearer ' + token
                };
                const response = await axios.put(url, { headers });

                if (response.status === 200) {
                    Swal.fire({
                        title: 'บันทึกข้อมูล',
                        icon: 'success',
                        text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                        timer: 1000
                    });

                    closeModal();
                    fetchData();
                }
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: (err as ErrorInterface).message
            })
        }
    }

    const handleSend = async () => {
        try {
            const url = Config.apiUrl + '/api/order/send';
            const payload = {
                traceCode: traceCode,
                express: express,
                remark: remark,
                orderId: order?.id
            }
            const token = localStorage.getItem(Config.tokenName);
            const headers = {
                'Authorization': 'Bearer ' + token
            };
            const response = await axios.put(url, payload, { headers });

            if (response.status === 200) {
                Swal.fire({
                    title: 'บันทึกข้อมูล',
                    text: 'บันทึกการจัดส่งแล้ว',
                    icon: 'success',
                    timer: 1000
                })

                closeModal();
                fetchData();
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: (err as ErrorInterface).message
            })
        }
    }

    return (
        <div className="container">
            <div className="title">รายการสั่งซื้อ</div>
            <table className="table">
                <thead>
                    <tr>
                        <th>วันที่</th>
                        <th>ผู้รับสินค้า</th>
                        <th>ที่อยู่จัดส่ง</th>
                        <th>เบอร์โทรติดต่อ</th>
                        <th>สถานะ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.customerName}</td>
                            <td>{order.customerAddress}</td>
                            <td>{order.customerPhone}</td>
                            <td>
                                {order.status == 'cancel' && <i className="fa fa-times text-red-500 mr-2"></i>}
                                {order.status == 'paid' && <i className="fa fa-check text-green-700 mr-2"></i>}
                                {order.status == 'send' && <i className="fa fa-arrow-right text-blue-600 mr-2"></i>}
                                {order.statusText}
                            </td>
                            <td>
                                <button onClick={() => openModal(order)}>
                                    <i className="fa fa-file mr-2"></i>
                                    ดูข้อมูล
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <Modal title="รายการสินค้า" onClose={closeModal} size="xl">
                    <div>
                        <label>รหัสติดตามพัสดุ</label>
                        <input value={order?.trackCode} onChange={(e) => setTraceCode(e.target.value)} />
                    </div>
                    <div>
                        <label>บริษัทขนส่ง</label>
                        <input value={order?.express} onChange={(e) => setExpress(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label>เอกสารการโอนเงิน</label>
                        <Image alt="" src={Config.apiUrl + '/public/upload/slip/' + order?.slipImage}
                            className="w-[350px] rounded-xl" width={350} height={350}
                        />
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>รหัสสินค้า</th>
                                <th>ชื่อสินค้า</th>
                                <th style={{ textAlign: 'right' }}>ราคา</th>
                                <th style={{ textAlign: 'right' }}>จำนวน</th>
                                <th style={{ textAlign: 'right' }}>ยอดรวม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.OrderDetail.map((orderDetail) => (
                                <tr key={orderDetail.id}>
                                    <td>{orderDetail.Book.isbn}</td>
                                    <td>{orderDetail.Book.name}</td>
                                    <td className="text-right">{orderDetail.price}</td>
                                    <td className="text-right">{orderDetail.qty}</td>
                                    <td className="text-right">{orderDetail.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-gray-400 justify-center mt-3 text-xl flex gap-3">
                        <span>ยอดรวม:</span>
                        <span className="text-amber-300">{order?.sum.toLocaleString()}</span>
                        <span>บาท</span>
                    </div>

                    <div>
                        <label>หมายเหตุ</label>
                        <input value={order?.remark} onChange={(e) => setRemark(e.target.value)} />
                    </div>

                    <div className="mt-5 flex justify-center gap-2">
                        <button className="modal-btn-order-cancel" onClick={handleCancel}>
                            <i className="fa fa-times mr-2"></i>
                            ยกเลิก
                        </button>
                        <button className="modal-btn-get-money" onClick={handlePaid}>
                            <i className="fa fa-check mr-2"></i>
                            ได้รับเงินแล้ว
                        </button>
                        <button className="modal-btn-send" onClick={handleSend}>
                            <i className="fa fa-circle-check mr-2"></i>
                            จัดส่งสินค้าแล้ว/บันทึก
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    )
}