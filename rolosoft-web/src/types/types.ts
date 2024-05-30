export type Address = {
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Student = {
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
    fieldPosition: string;
    shirtNumber: number;
    IMSS: string;
  };
};

export type School = {
  id: string;
  name: string;
  address: Address;
  sponsor: string;
  students: Student[];
};

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
  photoUrl: string;
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
  playerPhotoUrl: string;
  teamPhotoUrl: string;
};


export type RGoal = {
  match: Match | null;
  onClose: () => void;
};

export type RMatch = {
  onClose: () => void;
};

