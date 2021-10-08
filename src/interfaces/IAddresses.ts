export interface IAddress {
    id_address?: number | string,
    id_state: number | string,
    id_city: number | string,
    id_municipality: number | string,
    number: string,
    street: string
}

export interface IStates {
    id?: number | string,
    nombre: string,
    pais: number | string
}

export interface ICities {
    id?: number | string,
    nombre: string,
    estado: number | string
}

export interface IMunicipalities {
    id?: number | string,
    nombre: string,
    ciudad: string,
    municipio: string,
    asentamiento: string,
    codigo_postal: number
}