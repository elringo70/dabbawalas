export interface IProduct {
    id_product?: number | string,
    name: string,
    cost: number,
    price: number,
    image?: any,
    description: string,
    cookingTime: number,
    active: number,
    lastmodification?: Date,
    id_restaurant?: string | number | undefined
}