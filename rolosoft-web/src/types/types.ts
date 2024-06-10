export type Address = {
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  role: string;
  CURP: string;
  address: Address;
};
export type Student = {
  cards: any[];
  id: string;
  CURP: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  role: string;
  phone: string;
  address: Address;
  student: {
    greenCards: any;
    photoFileName?: any;
    fieldPosition: string;
    shirtNumber: number;
    IMSS: string;
  };
};

export type GreenCard = {
  id: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
};

export type School = {
  shieldFileName?: string;
  id: string;
  name: string;
  address: Address;
  sponsor: string;
  students: Student[];
  number: number;
};

export type Tournament = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  address: Address;
};

export type Goal = {
  id: string;
  name: string;
  lastName: string;
  minute: number;
  playerNumber: number;
};

export type Team = {
  shieldFileName: string;
  id: string;
  name: string;
  goals: Goal[];
  points: number;
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

export type GeneralT = {
  team: string;
  victories: number;
  draws: number;
  defeats: number;
  position: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  gamesPlayed: number;
};

export type GoalT = {
  studentId: string;
  firstName: string;
  lastName: string;
  teamName: string;
  goals: number;
  position: number;
  points: number;
  schoolId: string;
  photoFileName?: string;
  shieldFileName?: string;
};

export type RGoal = {
  match: Match | null;
  onClose: () => void;
};

export type RMatch = {
  onClose: () => void;
};

