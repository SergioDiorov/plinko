export const countScore = ({ gameData, othersSlotNumbers, slotsData }: { gameData: { [key: number]: number[] }, othersSlotNumbers: number[], slotsData: { [key: number]: number } }) => {
  let ourTeam = 0;
  let othersTeam = 0;

  Object.keys(gameData).forEach(slotKey => {
    const slot = parseInt(slotKey);
    const ballsInSlot = gameData[slot].length;
    if (othersSlotNumbers.includes(slot)) {
      othersTeam += ballsInSlot * slotsData[slot];
    } else {
      ourTeam += ballsInSlot * slotsData[slot];
    }
  })

  return { ourTeam, othersTeam }
}