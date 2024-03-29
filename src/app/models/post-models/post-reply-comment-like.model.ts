export class PostReplyCommentLikeModel {
  constructor(
    public _id: string,
    public sportizenUser: string,
    public post: string,
    public comment: string,
    public replyComment: string,
    public replyCommentLike: boolean,
    public createdAt: string,
    public userName?: string,
    public userImageURL?: string
  ) {}
}
