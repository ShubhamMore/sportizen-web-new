export class EventModel {
  constructor(
    public _id: string,
    public name: string,
    public eventType: string,
    public sport: string,
    public registrationType: string,
    public startDate: string,
    public endDate: string,
    public registerTill: string,
    public time: string,
    public address: string,
    public state: string,
    public city: string,
    public location: EventLocationModel,
    public description: string,
    public winningPrice: string,
    public fees: string,
    public noOfPlayers: string,
    public images: EventImageModel[],
    public createdBy: string,
    public createdAt: string,
    public modifiedAt: string,
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
