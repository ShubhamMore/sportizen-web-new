export class BlogModel {
  constructor(
    public _id: string,
    public title: string,
    public subtitle: string,
    public tags: string[],
    public description: string,
    // public images: BlogImageModel[],
    public imageName: string,
    public secureUrl: string,
    public publicId: string,
    public sportizenUser: string,
    public createdAt: string,
    public modifiedAt: string,
    public alreadyLiked?: boolean,
    public alreadyBookmarked?: boolean,
    public alreadyViewed?: boolean,
    public blogLikes?: number,
    public blogComments?: number,
    public blogViews?: number,
    public userName?: string,
    public userImageURL?: string
  ) {}
}

export class BlogImageModel {
  constructor(
    public _id: string,
    public imageName: string,
    public secureUrl: string,
    public publicId: string,
    public createdAt: string
  ) {}
}
