export class User {
  constructor(
    public email: string,

    public _id: string,
    public sportizenId: string,
    public userType: string,

    private _token: string,

    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
