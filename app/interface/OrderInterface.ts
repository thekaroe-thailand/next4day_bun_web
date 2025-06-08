import { MemberInterface } from "./MemberInterface";
import { OrderDetailInterface } from "./OrderDetailInterface";

export interface OrderInterface {
    id: string;
    createdAt: Date;
    member: MemberInterface;
    status: string;
    slipImage: string;
    trackCode: string;
    express: string;
    remark: string;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    OrderDetail: OrderDetailInterface[]
    sum: number;
    statusText: string;
}