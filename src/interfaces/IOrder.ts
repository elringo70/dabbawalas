export interface IOrder {
    id_order?: number,
    total: number,
    id_restaurant: number,
    id_customer: number,
    id_delivaryman?: number
}

export interface IOrderDetail {
    id_order: number,
    id_product: number,
    quantity: number
}