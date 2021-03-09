import { ConnectionStatus } from '../enums/connectionStatus';

export class UserProfileModel {
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public sportizenId: string,
    public height: string,
    public heightType: string,
    public weight: string,
    public weightType: string,
    public birthDate: string,
    public profileViews: number,
    public location: any,
    public phoneNo: string,
    public story: string,
    public accountType: string,
    public sportsInterest: string[],
    public gender: string,
    public userImageURL: string,
    public userImage: UserImage,
    public userCoverImageURL: string,
    public userCoverImage: UserImage,
    public userProvider: string,
    // Delete Following Attributes
    public connection: string,
    public profileCompleted: string,
    public followersCount?: string,
    public followingsCount?: string
  ) {}
}

class UserImage {
  constructor(
    public _id: string,
    public imageName: string,
    public secureUrl: string,
    public publicId: string,
    public createdAt: string
  ) {}
}
