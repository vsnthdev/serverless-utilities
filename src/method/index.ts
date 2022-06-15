/*
 *  Provides support to supply different functions for different
 *  HTTP request methods.
 *  Created On 15 June 2022
 */

import { VercelRequest, VercelResponse } from '@vercel/node'
import { notFound } from '../notFound/index'

interface Methods {
    get?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    head?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    post?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    put?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    delete?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    connect?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    options?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    trace?: (req: VercelRequest, res: VercelResponse) => Promise<any>
    patch?: (req: VercelRequest, res: VercelResponse) => Promise<any>
}

export const methods = (req: VercelRequest, res: VercelResponse, methods: Methods) => {
    // a method always exists, so we cast it into a string
    const method = req.method?.toLowerCase() as "get" | "head" | "post" | "put" | "delete" | "connect" | "options" | "trace" | "patch"

    // grab the function that has been mapped to the user sent
    // request method
    const handler = methods[method]

    // handle when no method has been defined
    if (!handler) return notFound(req, res)

    return handler(req, res)
}
