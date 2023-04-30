/*
 *  Contains a serverless function wrapper that makes
 *  it easy to be used.
 *  Created On 30 April 2023
 */

import type { ZodObject } from 'zod'
import { Request, Response, notFound } from './notFound'

export interface RouteConfig {
    handler: (req: Request, res: Response) => Promise<any>
    validation?: {
        params?: ZodObject<any>
        query?: ZodObject<any>
        body?: ZodObject<any>
    }
}

export interface FunctionConfig {
    get?: RouteConfig
    put?: RouteConfig
    head?: RouteConfig
    post?: RouteConfig
    trace?: RouteConfig
    patch?: RouteConfig
    delete?: RouteConfig
    connect?: RouteConfig
    options?: RouteConfig
}

export type RequestMethod = "get" | "head" | "post" | "put" | "delete" | "connect" | "options" | "trace" | "patch"

async function validate(req: Request, res: Response, route: RouteConfig) {
    // validate route
    if (route.validation) {
        if (route.validation.query) {
            try {
                req.query = await (route.validation.query as any).validateAsync(req.query)
            } catch (err) {
                res.status(400).json({
                    error: true,
                    message: 'Invalid query parameters',
                    data: (err as any).details[0]
                })

                return false
            }
        }

        if (route.validation.body) {
            try {
                req.body = await (route.validation.body as any).validateAsync(req.body)
            } catch (err) {
                res.status(400).json({
                    error: true,
                    message: 'Invalid request body',
                    data: (err as any).details[0]
                })

                return false
            }
        }
    }

    return true
}

/** A helpful utility function that wraps around your
 * serverless function to make it easy to use.
 */
export async function func(req: Request, res: Response, config: FunctionConfig) {
    // get current request method
    const method = req.method.toLowerCase() as RequestMethod

    // grab the function that has been mapped to
    // the user sent request method
    const route = config[method]

    // handle when no method has been defined
    if (!route) return notFound(req, res)

    // validate all the different parameters
    if (await validate(req, res, route)) {
        // finally execute the handler function
        return route.handler(req, res)
    }
}
