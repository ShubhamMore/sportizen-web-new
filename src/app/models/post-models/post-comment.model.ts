import { PostReplyCommentModel } from './post-reply-comment.model';

export class PostCommentModel {
  constructor(
    public _id: string,
    public comment: string,
    public sportizenId: string,
    public postCommentLikes?: number,
    public postReplyComments?: number,
    public name?: string,
    public userImageURL?: string,
    public alreadyLiked?: boolean,
    public createdAt?: string,
    public replyComments?: PostReplyCommentModel[]
  ) {}
}
