export interface IOrder extends IOrderDetail{
    id_order?: number,
    total: number,
    orderstatus: string,
    id_restaurant: number,
    id_customer: number,
    id_delivaryman?: number,
    day_count: number,
    day_name: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
}

export interface IOrderDetail {
    id_order?: number | string,
    id_product: number,
    id_restaurant: number,
    quantity: number
}

export interface IPostingOrder {
    quantity: number[],
    id_product: number[],
    price: number[],
    phone: string | number
}