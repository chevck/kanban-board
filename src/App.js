import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateRow } from "./components/createRow";
import { CreateTicket } from "./components/createTicket";
import { DeleteModal } from "./components/DeleteModal";
import { fetch_rows, reorder_tickets } from "./redux/reducers";
import { getRows } from "./redux/selectors";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./style.scss";

function App() {
  const [deleteConfig, setDeleteConfig] = useState({});
  const [createTicketConfig, setCreateTicketConfig] = useState({});

  const dispatch = useDispatch();
  const rows = useSelector(getRows);

  useEffect(() => {
    dispatch(fetch_rows());
    console.log("here");
  }, [dispatch]);

  const onDragEnd = (result) => {
    console.log({ result });
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    dispatch(reorder_tickets(result));

    // const quotes = reorder(
    //   state.quotes,
    //   result.source.index,
    //   result.destination.index
    // );

    // setState({ quotes });
  };

  return (
    <div className="container-fluid">
      <div>
        {rows?.length ? (
          <button
            type="button"
            className="btn create-row-btn"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Create New Row
          </button>
        ) : null}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided, index) => (
            <div
              className="board-rows-wrapper list"
              key={index}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {!rows.length ? (
                <div className="empty-container">
                  <h2>Welcome to this Kanban Board</h2>
                  <h6>Click the button below to create sections</h6>
                  <button
                    className="btn"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    New Section <i className="bi bi-plus-circle-fill"></i>{" "}
                  </button>
                </div>
              ) : (
                rows.map((row, index) => (
                  <div className="board-row" key={index}>
                    <div className="header">
                      <div className="left-side">
                        <span className="title">{row.name}</span>
                        <span className="count">
                          {row?.tickets ? row.tickets.length : 0}
                        </span>
                      </div>
                      <div className="right-side">
                        <i
                          className="bi bi-plus-circle-fill"
                          data-bs-toggle="modal"
                          data-bs-target="#createTicketModal"
                          onClick={() =>
                            setCreateTicketConfig({ rowid: row.rowid })
                          }
                        />
                        <i
                          className="bi bi-trash3"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                          onClick={() =>
                            setDeleteConfig({
                              type: "row",
                              name: row.name,
                              id: row.id,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="body">
                      {row.tickets.map((ticket, index) => (
                        <Draggable draggableId={ticket.summary} index={index}>
                          {(provided) => (
                            <div
                              className="ticket tickets"
                              key={ticket.id}
                              index={index}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h5>{ticket.summary}</h5>
                              <div className="tags-wrapper">
                                <p
                                  className={`tag ${ticket.tag.toLowerCase()}`}
                                >
                                  {ticket.tag}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <CreateRow />
      <CreateTicket rowid={createTicketConfig.rowid} />
      <DeleteModal
        type={deleteConfig?.type}
        name={deleteConfig.name}
        id={deleteConfig.id}
      />
    </div>
  );
}

export default App;
