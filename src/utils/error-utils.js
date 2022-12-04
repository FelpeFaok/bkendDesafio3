import { ERROR } from "../const/index.js"

export class ValidationError extends Error {
    constructor(message){
        //con super entras a la clase traida
        super(message)
        this.name = ERROR.VALIDATION_ERRROR
    }
}

export class notFoundError extends Error {
    constructor(message){
        //con super entras a la clase traida
        super(message)
        this.name = ERROR.NOT_FOUND_ERRROR
    }
}