export interface Participant {
  id: number
  name: string
  photo: string
  damaScore: number // 다마수 (10-1000, increments of 10)
  threeCushion: number // 쓰리큐 (1-30, increments of 1)
  victoryPoints: number // 승점 (starts at 100, increments of 10)
}

export interface GameState {
  inProgress: boolean
  participants: number[] // participant IDs
  startTime?: Date
}

export interface ScoreAdjustment {
  participantId: number
  rank: number
  pointsAwarded: number
}
