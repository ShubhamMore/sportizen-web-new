export class PostModel {
  constructor(
    public _id: string,
    public sportizenUser: string,
    public postType: string,
    public description: string,
    public fileName: string,
    public secureUrl: string,
    public publicId: string,
    public createdAt: string,
    public modifiedAt: string,
    public visibility: string,
    public sharedPost?: PostModel,
    public alreadyLiked?: boolean,
    public alreadyBookmarked?: boolean,
    public alreadyViewed?: boolean,
    public postLikes?: number,
    public postComments?: number,
    public postViews?: number,
    public userImageURL?: string,
    public userName?: string
  ) {}
}
