import { Session } from 'express-session'


declare module 'express-session' {
 export interface Session {
    returnTo: string;
  }
}

declare global {
  namespace Express {
      // tslint:disable-next-line:no-empty-interface
      interface AuthInfo {}
      // tslint:disable-next-line:no-empty-interface
      interface User {
        username:string;
        _id:any;
        stays:Array<any>;
        bookings:Array<any>;
      }

      interface Request {
          authInfo?: AuthInfo | undefined;
          user?: User | undefined;

          // These declarations are merged into express's Request type
          login(user: User, done: (err: any) => void): void;
          login(user: User, options: any, done: (err: any) => void): void;
          logIn(user: User, done: (err: any) => void): void;
          logIn(user: User, options: any, done: (err: any) => void): void;

          logout(): void;
          logOut(): void;

          isAuthenticated(): this is AuthenticatedRequest;
          isUnauthenticated(): this is UnauthenticatedRequest;

          files?: [
            {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                path: string;
                size: number;
                filename: string;                  
            }
        ]
      }

      interface AuthenticatedRequest extends Request {
          user: User;
      }

      interface UnauthenticatedRequest extends Request {
          user?: undefined;
      }
  }
}


interface Request {
  /**
   * Array or dictionary of `Multer.File` object populated by `array()`,
   * `fields()`, and `any()` middleware.
   */
  files?: [
      {
          fieldname: string;
          originalname: string;
          encoding: string;
          mimetype: string;
          path: string;
          size: number;
          filename: string;                  
      }
  ]
}