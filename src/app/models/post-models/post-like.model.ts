export class LikeModel {
  constructor(
    public _id: string,
    public sportizenId: string,
    public post: string,
    public postLike: boolean,
    public createdAt: string,
    public name?: string,
    public userProfile?: string,
    public userImageURL?: string,
    public commentLike?: boolean
  ) {}
}
