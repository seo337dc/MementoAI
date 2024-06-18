import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 10px;
`;

export const Column = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  background-color: ${(props) => {
    if (props.isDraggingOver && !props.isBan) {
      return 'lightblue';
    }

    if (props.isDraggingOver && props.isBan) {
      return 'red';
    }

    return '#f1f2f4';
  }};
`;

export const Item = styled.div`
  padding: 16px;
  margin: 0 0 8px 0;
  background-color: #ffffff;
  box-shadow: var(
    --ds-shadow-raised,
    0px 1px 1px #091e4240,
    0px 0px 1px #091e424f
  );
  border: ${(props) => (props.$isSelected ? '2px dashed blue' : 'none')};
  border-radius: 5px;
`;
