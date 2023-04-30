/*
 *  A standard 404 API response that can be on
 *  a serverless function.
 *  Created On 30 April 2023
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export type Request = VercelRequest | NextApiRequest
export type Response = VercelResponse | NextApiResponse

/**
 * A function that sends a 404 not found response.
*/
export function notFound(_: Request, res: Response) {
    return res.status(404).json({
        error: false,
        message: 'Not found',
    })
}
