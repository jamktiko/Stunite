/*
 AUTH SERVICE TESTS
 npm test -- src/app/core/services/auth.service.spec.ts
  - login()
  - logout()
  - checkUserSession()
  - getToken()
*/

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../enviroments/enviroment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  let setItemSpy: jest.SpyInstance;
  let getItemSpy: jest.SpyInstance;
  let removeItemSpy: jest.SpyInstance;

  beforeEach(() => {
    // mock localStorage methods
    setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {});
    getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => null);
    removeItemSpy = jest
      .spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(() => {});

    // configure TestBed for testing
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JwtHelperService],
    });

    // inject authservice and httptestingcontroller
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // clean up after every test case
  afterEach(() => {
    httpMock.verify();

    jest.restoreAllMocks();
  });

  // authservice should be created correctly
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a user and store the user and token in localStorage', () => {
    const email = 'testuser@example.com';
    const password = 'password123';
    const mockResponse = {
      message: 'Login successful',
      token: 'fake-jwt-token',
      user: { id: 1, email: email },
    };
    // spy on the localStorage.setItem method to ensure it is called correctly
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // call the login method and subscribe to its response
    service.login(email, password).subscribe((response) => {
      // check that response contains the expected token and user data
      expect(response.token).toBe(mockResponse.token);
      expect(response.user.email).toBe(mockResponse.user.email);

      // verify that localStorage.setItem was called with the correct values
      expect(setItemSpy).toHaveBeenCalledWith(
        'currentUser',
        JSON.stringify(mockResponse.user)
      );
      expect(setItemSpy).toHaveBeenCalledWith('token', mockResponse.token);
      expect(setItemSpy).toHaveBeenCalledWith('userId', mockResponse.user.id);
    });

    // expect an HTTP POST request to the login endpoint
    const req = httpMock.expectOne(`${environment.baseUrl}/login/user`);
    expect(req.request.method).toBe('POST');

    // simulate a server response by "flushing" the mockResponse
    req.flush(mockResponse);
  });

  // logout method test + data removed from localStorage
  it('should log out the user and remove data from localStorage', () => {
    service.logout();

    expect(removeItemSpy).toHaveBeenCalledWith('currentUser');
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(removeItemSpy).toHaveBeenCalledWith('userId');
  });

  // checkUserSession method test
  it('should check the user session and populate currUser and isLoggedIn', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'fake-jwt-token';

    getItemSpy.mockImplementation((key) => {
      if (key === 'currentUser') {
        return JSON.stringify(mockUser);
      } else if (key === 'token') {
        return mockToken;
      }
      return null;
    });

    service.checkUserSession();

    expect(service.getCurrUser()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBe(true);
  });

  // getToken method test, token from localStorage
  it('should retrieve the token from localStorage', () => {
    const mockToken = 'fake-jwt-token';

    getItemSpy.mockImplementationOnce(() => mockToken);

    const token = service.getToken();
    expect(token).toBe(mockToken);
  });
});
