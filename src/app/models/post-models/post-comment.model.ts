import { ReplyCommentModel } from './post-reply-comment.model';

export class CommentModel {
  constructor(
    public _id: string,
    public comment: string,
    public userImageURL: string,
    public sportizenId: string,
    public postCommentLikes?: number,
    public postReplyComments?: number,
    public name?: string,
    public userProfile?: string,
    public alreadyLiked?: boolean,
    public createdAt?: string,
    public replyComments?: ReplyCommentModel[]
  ) {}
}
