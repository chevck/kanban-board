import axios from "axios";
import React, { useEffect, useState } from "react";
import { endpoint_url } from "./assets/constants";
import { CreateRow } from "./components/createRow";
import { CreateTicket } from "./components/createTicket";
import { DeleteModal } from "./components/DeleteModal";
import "./style.scss";

function App() {
  const [rows, setRows] = useState([]);
  const [deleteConfig, setDeleteConfig] = useState({});

  const getRows = async () => {
    const { data } = await axios.get(`${endpoint_url}/rows`);
    setRows(data);
  };

  useEffect(() => {
    getRows();
  }, []);

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

      <div className="board-rows-wrapper">
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
                  <span className="count">2</span>
                </div>
                <div className="right-side">
                  <i className="bi bi-plus-circle-fill"></i>
                  <i
                    className="bi bi-trash3"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                    onClick={() =>
                      setDeleteConfig({ type: "row", name: row.name })
                    }
                  />
                </div>
              </div>
              <div className="body"></div>
            </div>
          ))
        )}
      </div>
      <CreateRow setRows={setRows} rows={rows} />
      <CreateTicket />
      <DeleteModal type={deleteConfig?.type} name={deleteConfig.name} />
    </div>
  );
}

export default App;
