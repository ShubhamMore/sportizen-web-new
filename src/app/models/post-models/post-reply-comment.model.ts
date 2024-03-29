export class PostReplyCommentModel {
  constructor(
    public _id: string,
    public replyComment: string,
    public sportizenId: string,
    public postReplyCommentLikes?: number,
    public name?: string,
    public userImageURL?: string,
    public alreadyLiked?: boolean,
    public createdAt?: string
  ) {}
}
