'use client'

import axios from "axios"
import Swal from "sweetalert2"
import { Config } from "@/app/config"
import { CartInterface } from "@/app/interface/CartInterface"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ErrorInterface } from "@/app/interface/ErrorInterface"
import Image from "next/image"

export default function Cart() {
    const [carts, setCarts] = useState<CartInterface[]>([]);
    const [memberId, setMemberId] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [qrImage, setQrImage] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [myFile, setMyFile] = useState<File | null>(null);

    const router = useRouter();

    useEffect(() => {
        fetchDataMember()

        if (memberId != '') {
            fetchData();
        }
    }, [memberId]);

    useEffect(() => {
        computeTotalAmount();
    }, [carts])

    useEffect(() => {
        if (totalAmount > 0) {
            fetchQrImage();
        }
    }, [totalAmount])

    const fetchQrImage = async () => {
        try {
            const url = 'https://www.pp-qr.com/api/0868776053/' + totalAmount;
            console.log(url);
            const response = await axios.get(url);

            if (response.status === 200) {
                setQrImage(response.data.qrImage);
            }
        } catch (e: unknown) {
            Swal.fire({
                title: 'error',
                text: (e as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const computeTotalAmount = () => {
        let sum = 0;

        for (let i = 0; i < carts.length; i++) {
            const item = carts[i];
            sum += item.qty * item.book.price;
        }

        setTotalAmount(sum);
    }

    const fetchDataMember = async () => {
        try {
            const url = Config.apiUrl + '/api/member/info'
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenMember)
            }
            const response = await axios.get(url, { headers })

            if (response.status == 200) {
                setMemberId(response.data.id)
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/cart/list/' + memberId
            const response = await axios.get(url);

            if (response.status == 200) {
                setCarts(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const cart = carts.find(item => item.id === id);
            const button = await Swal.fire({
                title: 'ลบรายการ',
                text: 'ยืนยันการลบ ' + cart?.book.name,
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true
            })

            if (button.isConfirmed) {
                const url = Config.apiUrl + '/api/cart/delete/' + id;
                const response = await axios.delete(url);

                if (response.status === 200) {
                    fetchData();
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

    const upQty = async (id: string) => {
        try {
            const url = Config.apiUrl + '/api/cart/upQty/' + id;
            const response = await axios.put(url);

            if (response.status === 200) {
                fetchData();
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const downQty = async (id: string) => {
        try {
            const url = Config.apiUrl + '/api/cart/downQty/' + id;
            const response = await axios.put(url);

            if (response.status === 200) {
                fetchData();
            }
        } catch (err: unknown) {
            const error = err as ErrorInterface;
            if (error.status == 400) {
                Swal.fire({
                    text: 'สินค้าควรมีอย่างน้อย 1 รายกาาร',
                    title: 'ตรวจสอบรายการ',
                    icon: 'warning'
                })
            } else {
                Swal.fire({
                    title: 'error',
                    text: error.message,
                    icon: 'error'
                })
            }
        }
    }

    const uiCart = () => {
        return (
            <>
                <h1 className="text-xl font-bold">สินค้าในตะกร้า</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="w-[200px] text-left">สินค้า</th>
                            <th className="text-left">ชื่อ</th>
                            <th className="text-right w-[100px]">ราคา</th>
                            <th className="text-center w-[100px]">จำนวน</th>
                            <th className="text-right w-[100px]">ยอดรวม</th>
                            <th className="w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>

                <div className="text-center mt-5 text-xl font-bold">
                    ยอดรวม : {totalAmount.toLocaleString()} บาท
                </div>
            </>
        )
    }

    const handleSave = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            await handleUpdateMember();
            await handleUploadFile();
            await handleSaveOrder();

            router.push('/web/member/cart/success');
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: (err as ErrorInterface).message
            });
        }
    }

    const handleUpdateMember = async () => {
        const url = Config.apiUrl + '/api/cart/confirm';
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenMember)
        }
        const payload = {
            name: name,
            address: address,
            phone: phone
        }
        await axios.post(url, payload, { headers });
    }

    const handleChooseFile = (files: unknown) => {
        const chooseFiles: FileList = files as FileList;

        if (chooseFiles.length > 0) {
            const file = chooseFiles[0];
            setMyFile(file);
        }
    }

    const handleUploadFile = async () => {
        const form = new FormData();
        form.append('myFile', myFile as Blob);

        const url = Config.apiUrl + '/api/cart/uploadSlip';
        await axios.post(url, form);
    }

    const handleSaveOrder = async () => {
        if (myFile) {
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenMember)
            }
            const payload = {
                slipName: myFile.name
            }
            const url = Config.apiUrl + '/api/cart/confirmOrder';
            const response = await axios.post(url, payload, { headers });

            if (response.status === 200) {

            }
        }
    }

    const uiPay = () => {
        return (
            <div className="front pl-3 pr-3">
                <div className="text-xl font-bold">การชำระเงิน</div>
                <div className="text-center mt-2">
                    {qrImage && (
                        <Image alt="" src={qrImage} className="w-full border rounded-xl shadow-lg" />
                    )}
                </div>
                <form onSubmit={(e) => handleSave(e)}>
                    <div>
                        <div>ชื่อผู้รับสินค้า</div>
                        <input className="w-full" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <div>ที่อยู่ในการจัดส่ง</div>
                        <textarea onChange={(e) => setAddress(e.target.value)}
                            className="border rounded-md h-[100px] w-full shadow-lg p-2"></textarea>
                    </div>
                    <div>
                        <div>เบอร์โทร</div>
                        <input className="w-full" onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <div>เอกสารการโอน</div>
                        <input type="file" className="w-full"
                            onChange={(e) => handleChooseFile(e.target.files)} />
                    </div>
                    <div className="text-center">
                        <button type="submit">
                            <i className="fa fa-check mr-2"></i>
                            ส่งข้อมูล
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <>
            <div className="flex">
                <div>{uiCart()}</div>
                <div>{uiPay()}</div>
            </div>
        </>
    )
}