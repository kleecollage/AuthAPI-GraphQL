import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const validateJWT = (req: Request | any, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({
      success: false,
      errors: {
        messages: ['JWT is required'],
      },
      token,
    });
  }

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = payload.id;
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: {
        messages: ['Something went wrong', error.message],
      },
      token: null,
    });
  }
}
