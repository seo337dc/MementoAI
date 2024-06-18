export const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const isEven = (taskId) => parseInt(taskId) % 2 === 0;

export const checkEven = (moveItemIndex = 0, targetItemIndex = null) => {
  if (isEven(moveItemIndex) && isEven(targetItemIndex)) {
    return false;
  }
  return true;
};
