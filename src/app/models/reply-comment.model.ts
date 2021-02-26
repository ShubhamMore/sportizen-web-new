export class ReplyCommentModel {
  constructor(
    public _id: string,
    public replyComment: string,
    public userImageURL: string,
    public sportizenId: string,
    public postReplyCommentLikes?: number,
    public name?: string,
    public userProfile?: string,
    public alreadyLiked?: boolean,
    public createdAt?: string
  ) {}
}
