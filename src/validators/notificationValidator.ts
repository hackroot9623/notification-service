import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';


const metadataSchema = z.object({
  email: z.string().email().optional(),
  content: z.string(),
  userId: z.string().uuid().optional(),
});

export const notificationSchema = z.object({
  event: z.string(),
  deliveryVia: z.enum(['EMAIL', 'SYSTEM']),
  type: z.enum(['INSTANT', 'BATCH']),
  metadata: metadataSchema,
}).refine(data => {
  if (data.deliveryVia === 'EMAIL') {
    return data.metadata.email !== undefined;
  }
  if (data.deliveryVia === 'SYSTEM') {
    return data.metadata.userId !== undefined;
  }
  return true;
}, {
  message: 'Invalid metadata for the delivery method',
  path: ['metadata'],
});
  
export const validateNotification = (req: Request, res: Response, next: NextFunction) => {
  try {
    notificationSchema.parse(req.body);
    next();
  } catch (error:any) {
    res.status(400).json({ error: error.errors });
  }
};
