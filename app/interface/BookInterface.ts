import { ImportToStockInterface } from "./ImportToStockInterface"

export interface BookInterface {
    id: string,
    name: string,
    price: number
    description: string
    isbn: string
    createdAt: Date
    image: File | string
    ImportToStock: ImportToStockInterface[]
    sumImportToStock: number
}