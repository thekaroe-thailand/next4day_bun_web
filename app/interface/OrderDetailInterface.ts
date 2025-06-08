import { BookInterface } from "./BookInterface";
import { OrderInterface } from "./OrderInterface";

export interface OrderDetailInterface {
    id: string;
    Book: BookInterface;
    price: number;
    qty: number;
    Order: OrderInterface;
    amount: number;
}