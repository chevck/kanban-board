import axios from "axios";
import randomString from "random-string-gen";
import React, { useState } from "react";
import { endpoint_url } from "../assets/constants";

export const CreateTicket = () => {
  const [body, setBody] = useState({ sumamry: "", description: "", tag: "" });

  const closeModal = () => {
    document.getElementById("close-button").click();
  };

  const create = async () => {
    const { data } = await axios.post(`${endpoint_url}/rows`, {
      // name: title,
      ticketLength: 0,
      rowid: `R-${randomString({ type: "numeric", length: 4 })}`,
    });

    closeModal();
  };

  return (
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Create Issue
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
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
            <div>
              <textarea
                className="form-control context-box"
                onChange={(e) =>
                  setBody({ ...body, description: e.target.value })
                }
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              id="close-button"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary" onClick={create}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
