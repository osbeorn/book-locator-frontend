import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {

  private authenticated: boolean = false;

  private users: any = [
    {
      username: 'kastelic.benjamin@gmail.com',
      password: 'abcd1234'
    },
    {
      username: 'stasa.kumse@gmail.com',
      password: 'abcd1234'
    }
  ];

  login(user: any): boolean {
    const authenticatedUser = this.users
      .find(u => u.username === user.username && u.password === user.password);

    return this.authenticated = !!authenticatedUser;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}
