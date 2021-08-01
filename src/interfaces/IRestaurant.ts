export interface IRestaurant {
    id_restaurant?: number,
    name: string,
    type: string,
    street: string,
    number: string,
    municipality: string,
    city: string,
    state: string,
    phone: string
}

export interface IBusinessHours {
    id_restaurant: number,
    day: 1 | 2 | 3 | 4 | 5 | 6 | 0,
    openhours: string,
    closinghours: string
}

export interface IReqRest {
    restaurant?: IRestaurant,
    horarios?: IBusinessHours[],
    manager_id?: number
}