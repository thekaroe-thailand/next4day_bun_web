'use client'

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Config } from "../config";
import { BookInterface } from "../interface/BookInterface";
import { CartInterface } from "../interface/CartInterface";
import Link from "next/link";
import { ErrorInterface } from "../interface/ErrorInterface";
//import Image from "next/image";

export default function Home() {
    const [setBooks] = useState<BookInterface[]>([]);
    const [token, setToken] = useState('');
    const [carts, setCarts] = useState<CartInterface[]>([]);
    const [memberId, setMemberId] = useState('')
    const [qtyInCart, setQtyInCart] = useState(0);

    useEffect(() => {
        fetchData();
        readToken();
    }, []);

    useEffect(() => {
        if (memberId !== '') {
            fetchDataCart();
        }
    }, [memberId])

    const readToken = async () => {
        const token = localStorage.getItem(Config.tokenMember) ?? ''
        setToken(token);

        try {
            const url = Config.apiUrl + '/api/member/info'
            const headers = {
                'Authorization': 'Bearer ' + token
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
            const url = Config.apiUrl + '/api/book'
            const response = await axios.get(url);

            if (response.status === 200) {
                setBooks(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const fetchDataCart = async () => {
        try {
            if (token != '') {
                const url = Config.apiUrl + '/api/cart/list/' + memberId
                const response = await axios.get(url)

                if (response.status == 200) {
                    setCarts(response.data);
                    let sum = 0;

                    for (let i = 0; i < response.data.length; i++) {
                        const item = response.data[i];
                        sum += item.qty;
                    }

                    setQtyInCart(sum);
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
    /*
        const handleAddToCart = async (bookId: string) => {
            try {
                const url = Config.apiUrl + '/api/cart/add'
                const payload = {
                    memberId: memberId,
                    bookId: bookId
                }
                const response = await axios.post(url, payload);
    
                if (response.status == 200) {
                    fetchDataCart();
                }
            } catch (err: unknown) {
                Swal.fire({
                    title: 'error',
                    text: (err as ErrorInterface).message,
                    icon: 'error'
                })
            }
        }
        */

    return (
        <div className="p-3">
            <div className="text-right text-xl">
                สินค้าในตะกร้า <span className="font-bold text-red-500">{carts.length}</span> รายการ
                <span className="pl-3 text-blue-400 font-bold">{qtyInCart}</span> ชิ้น
                <Link href="/web/member/cart" className="ml-4 bg-green-700 px-5 py-2 rounded-2xl text-white shadow-md">
                    <i className="fa fa-shopping-cart mr-3"></i>
                    ตะกร้าของฉัน
                </Link>
            </div>
            <h1 className="text-2xl font-semibold">หนังสือในร้านเรา</h1>
            <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-6 lg:grid-cols-5 gap-2">
            </div>
        </div>
    );
}
