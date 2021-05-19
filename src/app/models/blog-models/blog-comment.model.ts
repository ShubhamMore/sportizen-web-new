export class BlogCommentModel {
  constructor(
    public _id: string,
    public comment: string,
    public sportizenId: string,
    public blogCommentLikes?: number,
    public name?: string,
    public userImageURL?: string,
    public alreadyLiked?: boolean,
    public createdAt?: string
  ) {}
}
