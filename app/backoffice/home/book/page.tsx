'use client'

import { Config } from "@/app/config"
import type { BookInterface } from "@/app/interface/BookInterface"
import axios from "axios"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Modal from "../components/Modal"
import { ErrorInterface } from "@/app/interface/ErrorInterface"
import Image from "next/image"
import { ImportToStockInterface } from "@/app/interface/ImportToStockInterface"

export default function Book() {
    const [books, setBooks] = useState<BookInterface[]>([])
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [isbn, setIsbn] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState<File | null>();
    const [imageUrl, setImageUrl] = useState('');
    const [isShowModalImportToStock, setIsShowModalImportToStock] = useState(false);
    const [bookForImportToStock, setBookForImportToStock] = useState<BookInterface>();
    const [qtyForImportToStock, setQtyForImportToStock] = useState(0);
    const [isShowModalHistoryImportToStock, setIsShowModalHistoryImportToStock] = useState(false);
    const [bookForHistoryImportToStock, setBookForHistoryImportToStock] = useState<BookInterface>();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/book'
            const response = await axios.get(url);

            if (response.status == 200) {
                response.data.forEach((book: BookInterface) => {
                    book.sumImportToStock = book.ImportToStock.reduce((sum, importToStock) => sum + importToStock.qty, 0);
                });

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

    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setIsbn('');
        setName('');
        setPrice(0);
        setDescription('');
    }

    const handleSave = async () => {
        try {
            let response: { status: number };
            const data = new FormData();
            data.append("image", image as Blob);
            data.append("isbn", isbn);
            data.append("name", name);
            data.append("price", price.toString());
            data.append("description", description);

            if (id == '') {
                //insert
                const url = Config.apiUrl + '/api/book';
                response = await axios.post(url, data);
            } else {
                // update
                const url = Config.apiUrl + '/api/book/' + id;
                response = await axios.put(url, data);
            }

            if (response.status == 200) {
                Swal.fire({
                    title: 'บันทึกข้อมูล',
                    text: 'บันทึกข้อมูลสำเร็จ',
                    icon: 'success',
                    timer: 1000
                })
                fetchData();
                closeModal();
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const handleEdit = (book: BookInterface) => {
        setId(book.id);
        setIsbn(book.isbn ?? '');
        setName(book.name);
        setPrice(book.price);
        setDescription(book.description ?? '');
        setImageUrl(book.image as string);

        openModal();
    }

    const handleDelete = async (book: BookInterface) => {
        const button = await Swal.fire({
            title: 'ลบข้อมูล',
            text: 'ยืนยันการลบหนังสือ ' + book.name,
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })

        if (button.isConfirmed) {
            const url = Config.apiUrl + '/api/book/' + book.id;
            const response = await axios.delete(url);

            if (response.status == 200) {
                Swal.fire({
                    title: 'ลบข้อมุล',
                    text: 'ลบข้อมูลสำเร็จ',
                    icon: 'success',
                    timer: 1000
                })

                fetchData();
            }
        }
    }

    const chooseFile = (files: unknown) => {
        const chooseFiles: FileList = files as FileList;

        if (chooseFiles.length > 0) {
            const file = chooseFiles[0];
            setImage(file);
        }
    }

    const openModalImportToStock = (book: BookInterface) => {
        setBookForImportToStock(book);
        setIsShowModalImportToStock(true);
    }

    const closeModalImportToStock = () => {
        setIsShowModalImportToStock(false);
    }

    const handleImportToStock = async () => {
        try {
            const url = Config.apiUrl + '/api/book/importToStock';
            const payload = {
                bookId: bookForImportToStock?.id,
                qty: qtyForImportToStock
            }
            const response = await axios.post(url, payload);

            if (response.status == 200) {
                Swal.fire({
                    title: 'รับสินค้าเข้าสต๊อค',
                    text: 'รับสินค้าเข้าสต๊อคสำเร็จ',
                    icon: 'success',
                    timer: 1000
                })
                fetchData();
                closeModalImportToStock();
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const openModalHistoryImportToStock = (book: BookInterface) => {
        setBookForHistoryImportToStock(book);
        setIsShowModalHistoryImportToStock(true);
    }

    const closeModalHistoryImportToStock = () => {
        setIsShowModalHistoryImportToStock(false);
    }

    return (
        <>
            <div className="container">
                <div className="title">หนังสือ</div>

                <div>
                    <button onClick={openModal}>
                        <i className="fa fa-plus mr-2"></i>
                        เพิ่มรายการ
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ภาพหนังสือ</th>
                            <th>isbn</th>
                            <th>ชื่อ</th>
                            <th style={{ textAlign: 'right' }}>ราคา</th>
                            <th>รายละเอียด</th>
                            <th style={{ textAlign: 'right' }}>จำนวนรับเข้าสต๊อค</th>
                            <th className="w-[200px]">action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book: BookInterface) => (
                            <tr key={book.id}>
                                <td className="text-center">
                                    {book.image != null ?
                                        <Image alt='' src={Config.apiUrl + '/public/uploads/' + book.image}
                                            className="w-[150px] rounded-xl shadow-md" width={150} height={150} />
                                        : <i className="fa fa-image text-6xl text-gray-500"></i>
                                    }
                                </td>
                                <td>{book.isbn}</td>
                                <td>{book.name}</td>
                                <td className="text-right">{book.price.toLocaleString()}</td>
                                <td>{book.description}</td>
                                <td className="text-right">
                                    {book.sumImportToStock < 10 && <span className="text-red-500 mr-3">สินค้าใกล้หมด</span>}
                                    <a href="#" onClick={() => openModalHistoryImportToStock(book)}>
                                        {book.sumImportToStock.toLocaleString()}
                                    </a>
                                </td>
                                <td>
                                    <div className="flex gap-1 items-center">
                                        <button className="btn-edit" onClick={() => openModalImportToStock(book)}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                        <button className="btn-edit"
                                            onClick={() => handleEdit(book)}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(book)}>
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal ?
                <Modal onClose={closeModal} title="ข้อมูลหนังสือ">
                    <div>
                        <label>isbn</label>
                        <input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                    </div>

                    <div>
                        <label>ชื่อ</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label>ราคา</label>
                        <input type="number" value={price}
                            onChange={(e) => setPrice(parseInt(e.target.value))} />
                    </div>

                    <div>
                        <label>รายละเอียด</label>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <label>รูปภาพ</label>
                        {imageUrl != '' ?
                            <Image width={150} height={150} alt="" src={Config.apiUrl + '/public/uploads/' + imageUrl}
                                className="rounded-lg mt-3 mb-3"
                            />
                            : null}
                        <input type="file" onChange={(e) => chooseFile(e.target.files)} />
                    </div>

                    <div className="mt-5">
                        <button className="modal-btn-submit modal-btn" onClick={handleSave}>
                            <i className="fa fa-check mr-2"></i>
                            Save
                        </button>
                    </div>
                </Modal>
                : null
            }

            {isShowModalImportToStock ?
                <Modal onClose={closeModalImportToStock} title="รับสินค้าเข้าสต๊อค">
                    <div>
                        <label>หนังสือที่จะรับสินค้าเข้าสต๊อค</label>
                        <input value={bookForImportToStock?.name} disabled />
                    </div>

                    <div>
                        <label>จำนวนหนังสือ</label>
                        <input type="number" value={qtyForImportToStock}
                            onChange={(e) => setQtyForImportToStock(parseInt(e.target.value ?? '0'))} />
                    </div>

                    <div className="mt-5">
                        <button className="modal-btn-submit modal-btn" onClick={handleImportToStock}>
                            <i className="fa fa-check mr-2"></i>
                            Save
                        </button>
                    </div>
                </Modal>
                : null
            }

            {isShowModalHistoryImportToStock ?
                <Modal onClose={closeModalHistoryImportToStock} title="ประวัติการรับสินค้าเข้าสต๊อค">
                    <label>หนังสือ</label>
                    <input value={bookForHistoryImportToStock?.name} disabled />

                    <table className="table">
                        <thead>
                            <tr>
                                <th>วันที่</th>
                                <th style={{ textAlign: 'right' }}>จำนวน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookForHistoryImportToStock?.ImportToStock.map((importToStock: ImportToStockInterface) => (
                                <tr key={importToStock.id}>
                                    <td>{new Date(importToStock.createdAt).toLocaleDateString()}</td>
                                    <td className="text-right">{importToStock.qty.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal>
                : null
            }
        </>
    )
}