/*
 *  A standard 404 response which can be exported on
 *  a 404 serverless function.
 *  Created On 15 June 2022
 */

import { VercelResponse } from '@vercel/node'

export const notFound = (req, res: VercelResponse) =>
    res.status(404).json({
        error: false,
        message: 'Not found',
        statusCode: 404
    })
