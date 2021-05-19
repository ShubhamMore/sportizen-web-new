export class BlogCommentLikeModel {
  constructor(
    public _id: string,
    public sportizenUser: string,
    public blog: string,
    public comment: string,
    public commentLike: boolean,
    public createdAt: string,
    public userName?: string,
    public userImageURL?: string
  ) {}
}
