/*
 *  A standard 404 response which can be exported on
 *  a 404 serverless function.
 *  Created On 15 June 2022
 */

import { VercelResponse } from '@vercel/node'

/**
 * A function that sends a 404 not found response.
 * @param req The HTTP request.
 * @param res The HTTP response to which we'll respond.
 */
export const notFound = (req, res: VercelResponse) =>
    res.status(404).json({
        error: false,
        message: 'Not found',
        statusCode: 404
    })
