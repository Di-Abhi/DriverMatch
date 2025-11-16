// src/validation/validateRequest.ts
import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateRequest(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.parseAsync(req.body);
      req.body = validatedBody;
      return next();
    } catch (err: any) {
      if (err?.issues) {
        const errors = err.issues.map((i: any) => ({ path: i.path.join('.'), message: i.message }));
        return res.status(400).json({ success: false, errors });
      }

      return res.status(400).json({ success: false, message: err?.message || 'Validation error' });
    }
  };
}
