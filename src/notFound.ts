/*
 *  A standard 404 API response that can be on
 *  a serverless function.
 *  Created On 30 April 2023
 */

import { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * A function that sends a 404 not found response.
*/
export function notFound(_: VercelRequest, res: VercelResponse) {
    return res.status(404).json({
        error: false,
        message: 'Not found',
    })
}
