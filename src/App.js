import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateRow } from "./components/createRow";
import { CreateTicket } from "./components/createTicket";
import { DeleteModal } from "./components/DeleteModal";
import { delete_ticket, fetch_rows, reorder_tickets } from "./redux/reducers";
import { getRows } from "./redux/selectors";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./style.scss";
import { ViewTicket } from "./components/viewTicket";

function App() {
  const [deleteConfig, setDeleteConfig] = useState({});
  const [createTicketConfig, setCreateTicketConfig] = useState({});
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const dispatch = useDispatch();
  const rows = useSelector(getRows);

  useEffect(() => {
    dispatch(fetch_rows());
  }, [dispatch]);

  useEffect(() => {
    const props = window.location;
    const query = props.search;
    const split = query.split("=");
    const id = Number(split[1]);
    setSelectedTicketId(id);
  }, []);

  const onDragEnd = (result) => {
    console.log("dragged again", result);
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    dispatch(reorder_tickets(result));
  };

  const onMouseOver = (id) => {
    document.getElementById(id).classList.add("show");
  };

  const onMouseRemove = (id) => {
    document.getElementById(id).classList.remove("show");
  };

  const copyTicketLink = (id) => {
    var inputc = document.body.appendChild(document.createElement("input"));
    inputc.value = `${window.location.origin}/tickets?view=${id}`;
    inputc.focus();
    inputc.select();
    document.execCommand("copy");
    inputc.parentNode.removeChild(inputc);
    alert("URL Copied.");
  };

  const deleteTicket = (id) => {
    dispatch(delete_ticket({ id }));
  };

  console.log({ rows });

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
                              index={Number(ticket.id)}
                              ref={provided.innerRef}
                              id={`ticket-${ticket.id}`}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onMouseOver={() =>
                                onMouseOver(`ticket-${ticket.id}`)
                              }
                              onMouseOut={() =>
                                onMouseRemove(`ticket-${ticket.id}`)
                              }
                            >
                              <div className="left">
                                <h5>{ticket.summary}</h5>
                                <div className="tags-wrapper">
                                  <p
                                    className={`tag ${ticket.tag.toLowerCase()}`}
                                  >
                                    {ticket.tag}
                                  </p>
                                </div>
                              </div>
                              <div className="right">
                                <div class="btn-group">
                                  <button
                                    class="btn btn-secondary btn-sm dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i class="bi bi-three-dots-vertical" />
                                  </button>
                                  <ul class="dropdown-menu">
                                    <li
                                      onClick={() => copyTicketLink(ticket.id)}
                                    >
                                      <i class="bi bi-link-45deg"></i> Share
                                      Link
                                    </li>
                                    <li onClick={() => deleteTicket(ticket.id)}>
                                      <i class="bi bi-trash2-fill"></i> Delete
                                      Ticket
                                    </li>
                                  </ul>
                                </div>
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
      <ViewTicket id={selectedTicketId} />
    </div>
  );
}

export default App;
