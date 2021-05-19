export class PostCommentLikeModel {
  constructor(
    public _id: string,
    public sportizenUser: string,
    public post: string,
    public comment: string,
    public commentLike: boolean,
    public createdAt: string,
    public userName?: string,
    public userImageURL?: string
  ) {}
}
