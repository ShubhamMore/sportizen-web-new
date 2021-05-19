export class BlogViewModel {
  constructor(
    public _id: string,
    public sportizenId: string,
    public blogView: boolean,
    public createdAt: string,
    public name?: string,
    public userImageURL?: string
  ) {}
}
