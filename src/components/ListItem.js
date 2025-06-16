// ListItem.js
const ListItem = ({ item, onArrowClick, containerType }) => (
    <div className="list-item">
      <span>{item.name}</span>
      {containerType === 'left' && (
        <img src="/arrow-right.png" alt="Move right" onClick={() => onArrowClick(item, 'right')} />
      )}
      {containerType === 'right' && (
        <img src="/arrow-left.png" alt="Move left" onClick={() => onArrowClick(item, 'left')} />
      )}
      {containerType === 'middle' && (
        <>
          <img src="/arrow-left.png" alt="To left" onClick={() => onArrowClick(item, 'left')} />
          <img src="/arrow-right.png" alt="To right" onClick={() => onArrowClick(item, 'right')} />
        </>
      )}
    </div>
  );
  export default ListItem;
  