import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.model';
//** ------------------------------ REGISTER ------------------------------ **//
export const register = async (req: Request, res: Response) => {
  const {name, email, password} = req.body
  try {
    let user = await User.findOne({ email })
    if (user) {
      res.status(400).json({
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
         res.status(500).json({
            success: false,
            errors: {
              messages: ["Server error", error]
            },
            token: null,
          });
        }
       res.status(200).json({
          success: true,
          errors: null,
          token,
          username: newUser.username,
          email: newUser.email,
          id: newUser.id,
        });
      }
    )
  } catch (error) {
   res.status(500).json({
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
      res.status(400).json({
        success: false,
        errors: {
          messages: ['Invalid credentials']
        },
        token: null,
      });
    };

    const validatePassword = bcrypt.compareSync(password, user.password)
    if (!validatePassword) {
      res.status(400).json({
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
        res.status(200).json({
          success: true,
          errors: null,
          token,
          username: user.username,
          email: user.email,
          id: user.id,
        });
      }
    )
  } catch (error) {
    res.status(500).json({
        success: false,
        errors: {
          messages: ['Something went wrong', error]
        },
        token: null,
      });
  }
}
//** ------------------------------ UPDATE PASSWORD ------------------------------ **//
export const changePassword = async (req: Request | any, res: Response, next: NextFunction) => {
  const uid = req.uid;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(uid);
    const validPassword = bcrypt.compareSync(oldPassword, user.password)

    if (!validPassword) {
      res.status(400).json({
        success: false,
        errors: {
          messages: ['Old password is incorrect'],
        },
        token: null,
      });
    };

    const salt = bcrypt.genSaltSync(12);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    await User.findByIdAndUpdate(uid, {password: newPasswordHash})

    res.status(201).json({
      success: true,
      errors: null,
      token: null
    })
  } catch (error) {
    next(error);
  }
}
//** ------------------------------ UPDATE USERNAME ------------------------------ **//
export const changeUsername = async (req: Request | any, res: Response) => {
  const uid = req.uid;
  const { newUsername: username } = req.body;

  try {
    await User.findByIdAndUpdate(uid, { username })

    res.status(201).json({
      success: true,
      errors: null,
      token: null
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: {
        messages: ['Something went wrong', error]
      },
      token: null,
    });
  }
}