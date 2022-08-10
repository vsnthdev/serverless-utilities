/*
 *  Contains interface for route config.
 *  Created On 11 August 2022
 */

import Joi from 'joi'
import { Request, Response } from './function/index'

export interface RouteConfig {
    handler: (req: Request, res: Response) => Promise<any>
    sensitive?: boolean
    validation?: {
        params?: Joi.ObjectSchema
        query?: Joi.ObjectSchema
        body?: Joi.ObjectSchema | Joi.ArraySchema
    }
}

export interface FunctionConfig {
    get?: RouteConfig
    head?: RouteConfig
    post?: RouteConfig
    put?: RouteConfig
    delete?: RouteConfig
    connect?: RouteConfig
    options?: RouteConfig
    trace?: RouteConfig
    patch?: RouteConfig
}
