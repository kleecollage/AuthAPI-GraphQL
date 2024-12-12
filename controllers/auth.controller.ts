import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.model';
//** ------------------------------ REGISTER ------------------------------ **//
export const register = async (req: Request, res: Response) => {
  const {name, email, password} = req.body
  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        success: false,
        errors: {
          messages: ['User already exists']
        },
        token: null,
      });
    };

    const newUser = new User({ username: name, email, password });
    const salt = bcrypt.genSaltSync(12);
    newUser.password = bcrypt.hashSync(password, salt)

    await newUser.save();

    const payload = {
      id: newUser.id,
      email: newUser.email
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
      expiresIn: '4h',
      },
      (error, token) => {
        if (error) {
          return res.status(500).json({
            success: false,
            errors: {
              messages: ["Server error", error]
            },
            token: null,
          });
        }
        return res.status(200).json({
          success: true,
          errors: null,
          token,
        });
      }
    )
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: {
        messages: ["Server error", error]
      },
      token: null,
    });
  };
}
//** ------------------------------ LOGIN ------------------------------ **//
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        errors: {
          messages: ['Invalid credentials']
        },
        token: null,
      });
    };

    const validatePassword = bcrypt.compareSync(password, user.password)
    if (!validatePassword) {
      return res.status(400).json({
        success: false,
        errors: {
          messages: ['Invalid credentials']
        },
        token: null,
      });
    };

    const payload = {
      id: user.id,
      email: user.email
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
      expiresIn: '4h',
      },
      (error, token) => {
        if (error) {
          return res.status(500).json({
            success: false,
            errors: {
              messages: ["Server error", error]
            },
            token: null,
          });
        }
        return res.status(200).json({
          success: true,
          errors: null,
          token,
        });
      }
    )
  } catch (error) {
    return res.status(500).json({
        success: false,
        errors: {
          messages: ['Something went wrong', error]
        },
        token: null,
      });
  }
}