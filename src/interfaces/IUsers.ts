export interface IUser {
    id_user?: number | string,
    name: string,
    lastname: string,
    maternalsurname: string,
    dob: Date,
    phone: string,
    usertype?: 'M' | 'C' | 'D' | 'A' | 'CA',
    image?: string,
    active?: number,
    id_address?: number | string
}

export interface ICashier extends IUser {
    email: string,
    pass: string,
    id_restaurant: number | string
}

export interface IManager extends IUser {
    email: string,
    pass?: string,
    confpass?: string,
    gender: number,
    position?: string,
    verified?: 'VERIFIED' | 'UNVERIFIED' | 'REMOVED'
    id_restaurant?: number
}

export interface ICustomer {
    id_user?: number,
    name: string,
    lastname: string,
    maternalsurname: string,
    phone: string,
    usertype: 'C',
    gender: 1 | 0 | null,
    image?: string,
    lastpurchase?: string,
    active: number,
    id_restaurant: number | string,
    id_address?: number
}

export interface ICustomers {
    id_user?: number,
    email?: string,
    pass?: string,
    confpass?: string,
    name: string,
    lastname: string,
    maternalsurname: string,
    dob?: Date,
    street: string,
    number: string,
    municipality: string,
    city: string,
    state: string,
    phone: string,
    gender?: number,
    usertype: string,
    image?: string,
    active: number,
    verified?: 'VERIFIED' | 'UNVERIFIED' | 'REMOVED'
}

export interface ICooker {
    id_user?: number | string,
    email?: string,
    pass: string,
    name: string,
    lastname: string,
    maternalsurname: string,
    usertype: string,
    active: number,
    id_restaurant?: number | string
}

export interface IAdmin {
    id_user?: number,
    email?: string,
    pass?: string,
    confpass?: string,
    name: string,
    lastname: string,
    maternalsurname: string,
    dob?: Date,
    street: string,
    number: string,
    municipality: string,
    city: string,
    state: string,
    phone: string,
    gender?: number,
    usertype: 'C' | 'M' | 'D' | 'A',
    image?: string,
    lastpurchase?: string,
    active: number,
    verified: 'VERIFIED' | 'UNVERIFIED' | 'REMOVED'
    id_restaurant?: number | string
}