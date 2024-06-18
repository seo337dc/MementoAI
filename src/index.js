import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getItems, checkEven } from './const';
import * as S from './main.style';

function App() {
  const [columns, setColumns] = useState([
    { columnId: 'col-1', title: 'To do', itemsList: [] },
    { columnId: 'col-2', title: 'In progress', itemsList: [] },
    { columnId: 'col-3', title: 'Roll back', itemsList: [] },
    { columnId: 'col-4', title: 'Done', itemsList: [] },
  ]);

  const [isBan, setIsBan] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;

      if (!destination) return;

      const startColumn = columns.find(
        (col) => col.columnId === source.droppableId
      );
      const endColumn = columns.find(
        (col) => col.columnId === destination.droppableId
      );

      if (!startColumn || !endColumn) return;

      // 3-1. 첫 번째 칼럼에서 세 번째 칼럼으로는 아이템 이동이 불가능
      if (startColumn.columnId === 'col-1' && endColumn.columnId === 'col-3') {
        return;
      }

      const moveItem = startColumn.itemsList.find(
        (item) => item.id === result.draggableId
      );

      if (!moveItem) return;

      const targetItem = endColumn.itemsList[destination.index - 1];

      // 3-2. 짝수 아이템은 다른 짝수 아이템 앞으로 이동할 수 없다.
      const isCheckEven = checkEven(moveItem, targetItem);
      if (!isCheckEven) return;

      if (startColumn.columnId === endColumn.columnId) {
        const tempItems = Array.from(startColumn.itemsList);
        tempItems.splice(source.index, 1);
        tempItems.splice(destination.index, 0, moveItem);

        const newColumns = columns.map((column) => {
          if (startColumn.columnId === column.columnId) {
            return {
              ...column,
              itemsList: tempItems,
            };
          } else {
            return column;
          }
        });

        setColumns(newColumns);
      }

      if (startColumn.columnId !== endColumn.columnId) {
        // 4. 사용자가 여러 아이템을 선택하고, 이를 다른 칼럼으로 함께 드래그하여 이동할 수 있어야 합니다.
        if (selectedItems.length > 0) {
          const tempStartItems = Array.from(startColumn.itemsList);
          const tempSelectedItems = selectedItems.map((id) => {
            const item = tempStartItems.find((item) => item.id === id);
            tempStartItems.splice(tempStartItems.indexOf(item), 1);
            return item;
          });

          const tempEndItems = Array.from(endColumn.itemsList);
          tempEndItems.splice(destination.index, 0, ...tempSelectedItems);

          const newColumns = columns.map((column) => {
            if (startColumn.columnId === column.columnId) {
              return {
                ...column,
                itemsList: tempStartItems,
              };
            } else if (endColumn.columnId === column.columnId) {
              return {
                ...column,
                itemsList: tempEndItems,
              };
            } else {
              return column;
            }
          });

          setColumns(newColumns);
          setSelectedItems([]);
        } else {
          const tempStartItems = Array.from(startColumn.itemsList);
          tempStartItems.splice(source.index, 1);

          const temEndItems = Array.from(endColumn.itemsList);
          temEndItems.splice(destination.index, 0, moveItem);

          const newColumns = columns.map((column) => {
            if (startColumn.columnId === column.columnId) {
              return {
                ...column,
                itemsList: tempStartItems,
              };
            } else if (endColumn.columnId === column.columnId) {
              return {
                ...column,
                itemsList: temEndItems,
              };
            } else {
              return column;
            }
          });

          setColumns(newColumns);
        }
      }
    },
    [columns, selectedItems]
  );

  // 3-3. 이동할 수 없는 지점으로 아이템을 드래그 할 경우, 제약이 있음을 사용자가 알 수 있도록한다.
  const onDragUpdate = useCallback(
    (update) => {
      const { destination, draggableId, source } = update;

      if (!destination) {
        setIsBan(false);
        return;
      }

      const startColumn = columns.find(
        (col) => col.columnId === source.droppableId
      );
      const endColumn = columns.find(
        (col) => col.columnId === destination.droppableId
      );

      if (!startColumn || !endColumn) return;

      if (startColumn.columnId === 'col-1' && endColumn.columnId === 'col-3') {
        setIsBan(true);
        return;
      }

      const moveItem = startColumn.itemsList.find(
        (item) => item.id === draggableId
      );

      if (!moveItem) return;

      const targetItem = endColumn.itemsList[destination.index - 1];

      const isCheckEven = checkEven(moveItem, targetItem);

      if (!isCheckEven) {
        setIsBan(true);
        return;
      }

      setIsBan(false);
    },
    [columns]
  );

  const handleItemClick = (item) => {
    const alreadySelected = selectedItems.includes(item.id);
    if (alreadySelected) {
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  useEffect(() => {
    const initRandomItems = getItems(10).map((itemValue) => {
      const randColumId = Math.floor(Math.random() * 4) + 1;
      return {
        itemValue,
        columnId: randColumId,
      };
    });

    const initColumns = columns.map((column) => {
      const sameList = initRandomItems
        .filter((item) => `col-${item.columnId}` === column.columnId)
        .map((item) => item.itemValue);

      return {
        ...column,
        itemsList: sameList,
      };
    });

    setColumns(initColumns);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <S.Container>
        {columns.map((columnInfo) => (
          <Droppable
            key={columnInfo.columnId}
            droppableId={columnInfo.columnId}
          >
            {(provided, snapshot) => (
              <S.Column
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
                isBan={isBan}
              >
                <h2>{columnInfo.title}</h2>
                {columnInfo.itemsList.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <S.Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        $isSelected={selectedItems.includes(item.id)}
                        onClick={() => handleItemClick(item)}
                      >
                        {item.content}
                      </S.Item>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </S.Column>
            )}
          </Droppable>
        ))}
      </S.Container>
    </DragDropContext>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
