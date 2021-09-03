export interface IOrder {
    id_order?: number,
    total: number,
    orderstatus: string,
    id_restaurant: number,
    id_customer: number,
    id_delivaryman?: number
}

export interface IOrderDetail {
    id_order: number,
    id_product: number,
    id_restaurant: number,
    quantity: number
}