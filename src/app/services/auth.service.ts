import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

@Injectable()
export class AuthService {

  private authenticated: boolean = false;
  private authenticatedUser: User;

  private users: User[] = [
    {
      username: 'kastelic.benjamin@gmail.com',
      password: 'abcd1234',
      name: 'Benjamin Kastelic'
    },
    {
      username: 'stasa.kumse@gmail.com',
      password: 'abcd1234',
      name: 'Staša Kumše'
    }
  ];

  login(user: User): boolean {
    const authenticatedUser = this.users
      .find(u => u.username === user.username && u.password === user.password);

    if (authenticatedUser) {
      this.authenticated = true;
      this.authenticatedUser = authenticatedUser;

      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('authenticatedUser.username', this.authenticatedUser.username);
    }

    return this.authenticated;
  }

  logout(): void {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('authenticatedUser.username');

    this.authenticated = false;
    this.authenticatedUser = null;
  }

  isAuthenticated(): boolean {
    if (this.authenticated) {
      return true;
    }

    this.authenticated = (sessionStorage.getItem('authenticated') === 'true');
    if (this.authenticated) {
      const authenticatedUserUsername = sessionStorage.getItem('authenticatedUser.username');
      this.authenticatedUser = this.users.find(u => u.username === authenticatedUserUsername);
    }

    return this.authenticated;
  }

  getAuthenticatedUser(): User {
    if (this.authenticated) {
      return this.authenticatedUser;
    }
  }
}
