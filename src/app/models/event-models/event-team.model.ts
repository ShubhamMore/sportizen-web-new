import { PlayerModel } from '../player.model';

export class EventTeamModel {
  constructor(
    public _id: string,
    public event: string,
    public sportizenUser: string,
    public teamName: string,
    public teamMembers: PlayerModel[]
  ) {}
}
