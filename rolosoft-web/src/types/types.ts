export type Goal = {
    id: string;
    name: string;
    lastName: string;
    minute: number;
    playerNumber: number;
  };
  
  export type Team = {
    id: string;
    name: string;
    goals: Goal[];
  };
  
  export type Match = {
    id: string;
    teamA: Team;
    teamB: Team;
    dateTimeStart: string;
    dateTimeEnd: string;
  };
  
  export type Phase = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  