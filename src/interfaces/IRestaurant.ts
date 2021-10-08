export interface IRestaurant {
    id_restaurant?: number | string,
    name: string,
    type: string,
    phone: string,
    description: string,
    id_address?: number
}

export interface IBusinessHours {
    id_restaurant?: number,
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    openhours: string,
    closinghours: string
}

export interface IReqRest {
    restaurant?: IRestaurant,
    horarios?: IBusinessHours[],
    manager_id?: number
}