import { slots } from "src/constants/constants";

export const countScore = ({ gameData, othersSlotNumbers }: { gameData: { [key: number]: number[] }, othersSlotNumbers: number[] }) => {
  let ourTeam = 0;
  let othersTeam = 0;

  Object.keys(gameData).forEach(slotKey => {
    const slot = parseInt(slotKey);
    const ballsInSlot = gameData[slot].length;
    if (othersSlotNumbers.includes(slot)) {
      othersTeam += ballsInSlot * slots[slot];
    } else {
      ourTeam += ballsInSlot * slots[slot];
    }
  })

  return { ourTeam, othersTeam }
}