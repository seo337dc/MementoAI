export const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const isEven = (taskId) => parseInt(taskId) % 2 === 0;

export const checkEven = (moveItem = null, targetItem = null) => {
  const moveItemId = moveItem?.id.split('-')[1];
  const targetItemId = targetItem?.id.split('-')[1];

  if (isEven(moveItemId) && isEven(targetItemId)) {
    return false;
  }
  return true;
};
