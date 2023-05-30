/*
 *  A standard 404 API response that can be on
 *  a serverless function.
 *  Created On 30 April 2023
 */

export interface GenericResponse {
    status: any
}

export interface GenericRequest {
    method: any
    query: any
    body: any
}

/**
 * A function that sends a 404 not found response.
*/
export function notFound<Request, Response extends GenericResponse>(_: Request, res: Response) {
    return res.status(404).json({
        error: false,
        message: 'Not found',
    })
}
