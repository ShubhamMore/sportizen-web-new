export class EventPlayerModel {
  constructor(
    public _id: string,
    public event: string,
    public sportizenUser: string,
    public name: string,
    public email: string,
    public contact: string
  ) {}
}
