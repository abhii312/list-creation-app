import React from 'react';
import './ListContainer.css';

const ListContainer = ({
  listId,
  title,
  listItems,
  isChecked,
  onCheckboxChange,
  onArrowClick,
}) => {
  const isSelectionView = onCheckboxChange !== undefined;

  const handleArrowClick = (item, direction) => {
    if (onArrowClick) {
      const fromList = listId;
      const toList = direction === 'left'
        ? (listId === 3 ? 1 : 3)
        : (listId === 3 ? 2 : 3);

      onArrowClick(item, fromList, toList);
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h3>{title}</h3>
        {isSelectionView && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onCheckboxChange(listId)}
          />
        )}
      </div>
      <ul>
        {listItems.map((item) => (
          <li key={item.id} className="list-item">
            <div className="item-text">
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </div>
            {onArrowClick && (
              <div className="arrows">
                {(listId === 2 || listId === 3) && (
                  <button onClick={() => handleArrowClick(item, 'left')}>←</button>
                )}
                {(listId === 1 || listId === 3) && (
                  <button onClick={() => handleArrowClick(item, 'right')}>→</button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListContainer;
