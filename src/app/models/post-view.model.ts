export class PostViewModel {
  constructor(
    public _id: string,
    public sportizenId: string,
    public postView: boolean,
    public createdAt: string,
    public name?: string,
    public userImageURL?: string
  ) {}
}
