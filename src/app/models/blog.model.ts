export class BlogModel {
  constructor(
    public _id: string,
    public title: string,
    public subtitle: string,
    public description: string,
    public images: BlogImageModel[],
    public createdBy: string,
    public createdAt: string,
    public modifiedAt: string,
    public createdUserImage?: string,
    public createdUser?: string
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
