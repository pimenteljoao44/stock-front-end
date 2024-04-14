export interface CreateProductRequest {
    name:string,
    price:number,
    description:string,
    category:{
        id?:number,
        name?:string
    },
    amount:number
}