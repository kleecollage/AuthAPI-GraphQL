import { RESTDataSource } from '@apollo/datasource-rest';

export class AuthAPI extends RESTDataSource {
  override baseURL = 'http://localhost:3000/';
  //** ------------------------------ CREATE USER ------------------------------ **//
  async createUser(name: string, email: string, password: string) {
    const user = await this.post(`/auth/register/`, {
      body: { name, email, password }
    });

    return user;
  };
  //** ------------------------------ LOGIN USER ------------------------------ **//
  async loginUser(email: string, password: string) {
    const user = await this.post(`/auth/login/`, {
      body: { email, password }
    });

    return user;
  };
  //** ------------------------------ CHANGE PASSWORD ------------------------------ **//
  async changePassword(oldPassword: string, newPassword: string, token: string) {
    const user = await this.patch(`/auth/change-password/`, {
      body: { oldPassword, newPassword },
      headers: { 'x-auth-token': token }
    });

    return user;
  };
  //** ------------------------------ CHANGE USERNAME ------------------------------ **//
  async changeUsername(newUsername: string, token: string) {
    const user = await this.patch(`/auth/change-username/`, {
      body: { newUsername },
      headers: { 'x-auth-token': token }
    });

    return user;
  };
}