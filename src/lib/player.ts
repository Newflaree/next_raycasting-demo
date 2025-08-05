export interface Player {
  x: number;
  y: number;
  angle: number;
  speed: number;
  z: number;
  vz: number;
}

export const player: Player = {
  x: 100,
  y: 100,
  angle: 0,
  speed: 2,
  z: 0,
  vz: 0
}
