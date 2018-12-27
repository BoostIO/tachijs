import express from 'express'

export abstract class BaseResult {
  abstract execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<any>
}
