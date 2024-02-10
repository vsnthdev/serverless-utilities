/*
 *  Contains a serverless function wrapper that makes
 *  it easy to be used.
 *  Created On 30 April 2023
 */

import type { ZodObject } from 'zod'
import { notFound } from './notFound.js'
import { VercelRequest, VercelResponse } from '@vercel/node'

export type RequestMethod = "get" | "head" | "post" | "put" | "delete" | "connect" | "options" | "trace" | "patch"

export interface RouteConfig {
    handler: (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse> | VercelResponse
    validation?: {
        params?: ZodObject<any>
        query?: ZodObject<any>
        body?: ZodObject<any>
    }
}

export interface FunctionConfig {
    methods: {
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
    cors?: {
        allowedOrigin?: string
        allowedHeaders?: string[]
        allowCredentials?: boolean
        allowedMethods?: RequestMethod[]
    }
    caching?: {
        sharedCacheSeconds?: number
    }
}

async function validate(req: VercelRequest, res: VercelResponse, route: RouteConfig) {
    // validate route
    if (route.validation) {
        if (route.validation.query) {
            try {
                req.query = await route.validation.query.parse(req.query)
            } catch (err) {
                console.log(err)

                res.status(400).json({
                    error: true,
                    message: err.issues[0].message,
                    data: {}
                })

                return false
            }
        }

        if (route.validation.body) {
            try {
                req.body = route.validation.body.parse(req.body)
            } catch (err) {
                console.log(err)

                res.status(400).json({
                    error: true,
                    message: err.issues[0].message,
                    data: {}
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
export function func(config: FunctionConfig) {
    return async (req: VercelRequest, res: VercelResponse) => {
        // get current request method
        const method = req.method.toLowerCase() as RequestMethod

        if (config.cors) {
            if (config.cors.allowCredentials == true) {
                res.setHeader('Access-Control-Allow-Credentials', 'true')
            }

            if (config.cors.allowedHeaders) {
                res.setHeader('Access-Control-Allow-Headers', config.cors.allowedHeaders.join(', '))
            } else {
                if (config.cors) {
                    res.setHeader('Access-Control-Allow-Headers', '')
                }
            }

            if (config.cors.allowedMethods) {
                res.setHeader('Access-Control-Allow-Methods', config.cors.allowedMethods.join(',').toUpperCase())
            }

            if (config.cors.allowedOrigin) {
                res.setHeader('Access-Control-Allow-Origin', config.cors.allowedOrigin)
            }
        }

        // handle responding to OPTIONS request for CORS globally
        if (method == 'options' && config.cors) {
            return res.status(200).send('')
        }

        // handle caching
        if (config.caching?.sharedCacheSeconds) {
            res.setHeader(
                'Cache-Control',
                `max-age=0, s-maxage=${config.caching.sharedCacheSeconds}, stale-while-revalidate`,
            )
        }

        // grab the function that has been mapped to
        // the user sent request method
        const route = config.methods[method]

        // handle when no method has been defined
        if (!route) return notFound(req, res)

        // validate all the different parameters
        if (await validate(req, res, route)) {
            // finally execute the handler function
            return route.handler(req, res)
        }
    }
}
