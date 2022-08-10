/*
 *  Contains the main serverless function wrapper.
 *  Created On 11 August 2022
 */

import { FunctionConfig, RouteConfig } from '../interface'
import { notFound } from '../notFound/index'

import { VercelRequest, VercelResponse } from '@vercel/node'
import { NextApiRequest, NextApiResponse } from 'next'

export type Request = VercelRequest | NextApiRequest
export type Response = VercelResponse | NextApiResponse

const validate = async (req: Request, res: Response, route: RouteConfig) => {
    // validate query params if provided
    if (route.validation.query) {
        try {
            req.query = await route.validation.query?.validateAsync(req.query)
        } catch (err) {
            res.status(400).json({
                error: true,
                message: 'Invalid query parameters',
                data: (err as any).details[0]
            })

            return false
        }
    }

    // validate request body if a schema is provided
    if (route.validation.body) {
        try {
            req.body = await route.validation.body?.validateAsync(req.body)
        } catch (err) {
            res.status(400).json({
                error: true,
                message: 'Invalid request body',
                data: route.sensitive ? undefined : (err as any).details[0]
            })

            return false
        }
    }

    return true
}

export const func = async (req: Request, res: Response, config: FunctionConfig) => {
    // a method always exists, so we cast it into a string
    const method = req.method?.toLowerCase() as "get" | "head" | "post" | "put" | "delete" | "connect" | "options" | "trace" | "patch"

    // grab the function that has been mapped to
    // the user sent request method
    const route = config[method] as RouteConfig

    // handle when no method has been defined
    if (!route) return notFound(req, res)

    // validate all the different parameters
    if (await validate(req, res, route)) {
        // finally execute the handler function
        return route.handler(req, res)
    }
}
