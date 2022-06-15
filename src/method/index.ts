/*
 *  Provides support to supply different functions for different
 *  HTTP request methods.
 *  Created On 15 June 2022
 */

import { Request, Response, notFound } from '../notFound/index.js'

interface Methods {
    get?: (req: Request, res: Response) => Promise<any>
    head?: (req: Request, res: Response) => Promise<any>
    post?: (req: Request, res: Response) => Promise<any>
    put?: (req: Request, res: Response) => Promise<any>
    delete?: (req: Request, res: Response) => Promise<any>
    connect?: (req: Request, res: Response) => Promise<any>
    options?: (req: Request, res: Response) => Promise<any>
    trace?: (req: Request, res: Response) => Promise<any>
    patch?: (req: Request, res: Response) => Promise<any>
}

/**
 * A utility function that provides support to supply different functions for different HTTP request methods.
 * @param req The HTTP request.
 * @param res The HTTP response to which we'll respond.
 * @param methods Functions mapped to different HTTP request methods.
 */
export const methods = (req: Request, res: Response, methods: Methods) => {
    // a method always exists, so we cast it into a string
    const method = req.method?.toLowerCase() as "get" | "head" | "post" | "put" | "delete" | "connect" | "options" | "trace" | "patch"

    // grab the function that has been mapped to the user sent
    // request method
    const handler = methods[method]

    // handle when no method has been defined
    if (!handler) return notFound(req, res)

    return handler(req, res)
}
