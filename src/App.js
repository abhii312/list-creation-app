import React, { useEffect, useState } from "react";
import ListContainer from "./components/ListContainer";
import "./App.css";

const API_URL = "https://apis.ccbp.in/list-creation/lists";

function App() {
  const [lists, setLists] = useState({});
  const [selectedLists, setSelectedLists] = useState([]);
  const [listOrder, setListOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showNewList, setShowNewList] = useState(false);
  const [middleList, setMiddleList] = useState([]);

  // Fetch list items from API
  const fetchLists = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await fetch(API_URL);
      const data = await response.json();

      const grouped = {};
      const order = [];

      data.lists.forEach((item) => {
        const listNum = item.list_number;
        if (!grouped[listNum]) {
          grouped[listNum] = [];
          order.push(listNum);
        }
        grouped[listNum].push(item);
      });

      setLists(grouped);
      setListOrder(order);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCheckboxChange = (listId) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists(selectedLists.filter((id) => id !== listId));
    } else {
      setSelectedLists([...selectedLists, listId]);
    }
  };

  const handleCreateClick = () => {
    if (selectedLists.length !== 2) {
      setShowError(true);
    } else {
      setShowError(false);
      setShowNewList(true);
      setMiddleList([]);
    }
  };

  const handleMoveItem = (item, from, to) => {
    setLists((prevLists) => {
      const updatedFrom = prevLists[from].filter((i) => i.id !== item.id);
      const updatedTo = [...(prevLists[to] || []), item];

      return {
        ...prevLists,
        [from]: updatedFrom,
        [to]: updatedTo,
      };
    });
  };

  const handleMiddleMove = (item, direction) => {
    setMiddleList((prev) => prev.filter((i) => i.id !== item.id));

    const target = direction === "left" ? selectedLists[0] : selectedLists[1];
    setLists((prevLists) => {
      const updated = [...(prevLists[target] || []), item];
      return {
        ...prevLists,
        [target]: updated,
      };
    });
  };

  const handleItemToMiddle = (item, from) => {
    setLists((prevLists) => {
      const updatedFrom = prevLists[from].filter((i) => i.id !== item.id);
      return {
        ...prevLists,
        [from]: updatedFrom,
      };
    });
    setMiddleList((prev) => [...prev, item]);
  };

  const handleCancel = () => {
    setSelectedLists([]);
    setMiddleList([]);
    fetchLists(); // reset state
    setShowNewList(false);
    setShowError(false);
  };

  const handleUpdate = () => {
    setSelectedLists([]);
    setShowNewList(false);
    setShowError(false);
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <h1>List Creation</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="app-container">
        <h1>List Creation</h1>
        <p>Failed to fetch data. Please try again.</p>
        <button onClick={fetchLists}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>List Creation</h1>

      {showError && (
        <p style={{ color: "red" }}>
          You should select exactly 2 lists to create a new list
        </p>
      )}

      {!showNewList ? (
        <>
          <button onClick={handleCreateClick} className="create-btn">
            Create a new list
          </button>

          <div className="lists-wrapper">
            {listOrder.map((listId) => (
              <ListContainer
                key={listId}
                listId={listId}
                title={`List ${listId}`}
                listItems={lists[listId] || []}
                isChecked={selectedLists.includes(listId)}
                onCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="lists-wrapper">
            <ListContainer
              listId={selectedLists[0]}
              title={`List ${selectedLists[0]}`}
              listItems={lists[selectedLists[0]] || []}
              onArrowClick={(item) =>
                handleItemToMiddle(item, selectedLists[0])
              }
              arrowDirection="right"
            />
            <ListContainer
              title="New List"
              listItems={middleList}
              onArrowClick={(item, dir) => handleMiddleMove(item, dir)}
              showDoubleArrow
            />
            <ListContainer
              listId={selectedLists[1]}
              title={`List ${selectedLists[1]}`}
              listItems={lists[selectedLists[1]] || []}
              onArrowClick={(item) =>
                handleItemToMiddle(item, selectedLists[1])
              }
              arrowDirection="left"
            />
          </div>
          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleUpdate} className="update-btn">
            Update
          </button>
        </>
      )}
    </div>
  );
}

export default App;
