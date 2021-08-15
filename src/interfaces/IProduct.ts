export interface IProduct {
    id_product?: number,
    name: string,
    cost: number,
    price: number,
    image: any,
    description: string,
    active: number,
    lastmodification?: Date,
    id_restaurant: string | number | undefined
}