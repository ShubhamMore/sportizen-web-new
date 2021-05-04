export class EventModel {
  constructor(
    public _id: string,
    public name: string,
    public description: string,
    public sport: string,
    public eventType: string,
    public registrationType: string,
    public noOfPlayers: string,
    public noOfRegistrations: string,
    public winningPrice: number,
    public fees: number,
    public durationType: string,
    public startDate: string,
    public endDate: string,
    public registerTill: string,
    public time: string,
    public address: string,
    public state: string,
    public city: string,
    public location: EventLocationModel,
    public images: EventImageModel[],
    public createdBy: string,
    public createdAt: string,
    public modifiedAt: string,
    public createdUserImage?: string,
    public createdUser?: string,
    public registrations?: any[],
    public registration?: any,
    public isRegistered?: boolean
  ) {}
}

export class EventLocationModel {
  constructor(public type: string, public coordinates: number[]) {}
}

export class EventImageModel {
  constructor(
    public _id: string,
    public imageName: string,
    public secureUrl: string,
    public publicId: string,
    public createdAt: string
  ) {}
}
