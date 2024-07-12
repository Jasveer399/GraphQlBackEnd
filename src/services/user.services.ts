import { prismaClient } from "../lib/db";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const JWT_SECRET: string =
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2";

export interface createusertype {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
class UserServices {
  public static async createuser(payload: createusertype) {
    const { email, firstName, password, lastName } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);
    return prismaClient.user.create({
      data: {
        email,
        firstName,
        password: hashedPassword,
        lastName,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }

  public static async login(payload: LoginPayload) {
    const user = await this.getUserByEmail(payload.email);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const tokenpayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    };
    const token = await JWT.sign(tokenpayload, JWT_SECRET);
    return token;
  }

  public static decodeJWTtoken(token: string) {
    return JWT.verify(token, JWT_SECRET);
  }

  public static async getUserById(id: string) {
    return prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }
}

export default UserServices;
