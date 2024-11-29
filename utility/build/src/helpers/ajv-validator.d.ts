import { FormatsPluginOptions } from "ajv-formats";
import { Request } from "express";
declare class AjvValidator<T extends Object> {
    private schema;
    constructor(schema: T);
    /**
    * A function of for user validation using ajv
   
    * @param req - The request object
    * @returns  undefined if there is no  requset validation error
    *           the error array if there are some validation errors
    *
    */
    validateRequest(req: Request, formats?: FormatsPluginOptions): import("ajv").ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
}
export { AjvValidator };
