import { DatabaseConnector  } from "../database/databaseConnector.database";
import { IDatabaseManager } from "../interfaces/databaseManager.interfaces";
import { IUserLogin, IUserSignUp } from "../interfaces/user.interfaces";
import User from "../models/user.models";
import bcryptjs from "bcryptjs";
import { Document } from "mongoose";
import jwt from "jsonwebtoken";
import { config } from 'dotenv'; 
config();
export class DatabaseManager implements IDatabaseManager {
  private connector: DatabaseConnector;

  constructor() {
    this.connector = new DatabaseConnector();
  }
  async signUpUser(data: IUserSignUp): Promise<{ success: boolean; savedUser?: Document; error?: string }> {
    const { username, email, password } = data
    try {
      await this.connector.connect();
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return { success: false,error: "User already exists" };
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser:Document = await newUser.save();
      return { success: true, savedUser };
    } catch (error) {
      return {
        success: false,
        error: "DatabaseManager: signUpUser Internal server error" + error,
      };
    }
    finally {
      await this.connector.disconnect();
    }
  }
  async loginUser(data: IUserLogin): Promise<{ success: boolean; token?: string; error?: string }> {
    const { email, password } = data;
    try {
      await this.connector.connect();
      const user = await User.findOne({ email });

      if (!user) {
        return { success: false, error: "Usuario no encontrado" };
      }

      const validPassword = await bcryptjs.compare(password, user.password!);

      if (!validPassword) {
        return { success: false, error: "Contraseña inválida" };
      }

      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
      };

      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        expiresIn: "1d",
      });

      return { success: true, token };
    } catch (error) {
      return {
        success: false,
        error: "DatabaseManager: Error interno al iniciar sesión " + error,
      };
    }
    finally {
      await this.connector.disconnect();
    }
  }
}