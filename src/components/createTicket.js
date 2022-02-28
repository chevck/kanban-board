import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { create_tickets } from "../redux/reducers";

export const CreateTicket = ({ rowid }) => {
  const [body, setBody] = useState({ summary: "", description: "", tag: "" });
  const dispatch = useDispatch();

  const closeModal = () => {
    document.getElementById("create-ticket-close").click();
  };

  const create = async () => {
    const doc = { ...body, rowid };
    dispatch(create_tickets(doc));
    closeModal();
  };

  return (
    <div
      class="modal fade"
      id="createTicketModal"
      tabindex="-1"
      aria-labelledby="createTicketModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createTicketModalLabel">
              Create Issue
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="create-ticket-close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <label>Summary</label>
              <input
                className="form-control"
                onChange={(e) => setBody({ ...body, summary: e.target.value })}
              />
            </p>
            <p>
              <label>Description</label>
              <textarea
                className="form-control context-box"
                onChange={(e) =>
                  setBody({ ...body, description: e.target.value })
                }
              />
            </p>
            <p>
              <label>Tag</label>
              <select
                className="form-control"
                onChange={(e) => setBody({ ...body, tag: e.target.value })}
              >
                <option selected disabled>
                  Select Tag
                </option>
                <option>Feature</option>
                <option>Bug</option>
              </select>
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              onClick={create}
              disabled={!(body.description && body.summary && body.tag)}
            >
              Create Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
