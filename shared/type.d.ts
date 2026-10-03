export declare enum BookCategory {
    Fiction = 0,
    Science = 1,
    History = 2,
    Kids = 3
}
export interface Book {
    id: number;
    title: string;
    author: string;
    price: number;
    category: BookCategory;
    stock: number;
    description?: string;
}
export type UserRole = "user" | "admin";
export type PaymentStatus = "pending" | "paid" | "failed";
export interface Order {
    orderId: string;
    items: {
        bookId: number;
        quantity: number;
    }[];
    totalAmount: number;
    status: PaymentStatus;
    createdAt: Date;
}
//# sourceMappingURL=type.d.ts.map