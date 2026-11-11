
export enum ProductCategory{
    Alcoholic,
    NonAlcoholic,
    Fresh,
    Frozen,
    Pantry,
    PrePreparedMeals
}

export interface Product{
    name: string,
    id: string,
    price: number,
    stock: number,
    supplier: string,
    category: ProductCategory,
    description?: string
}

export type UserRole = "admin" | "customer"

export type PaymentStatus = "pending" | "paid" | "failed"

export interface Order{
    orderId: string,
    products: {product:Product, quantity:number}[]
    totalAmount: number,
    status: PaymentStatus,
    createdAt: Date
}