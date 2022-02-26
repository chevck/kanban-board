import axios from "axios";
import React, { useState } from "react";
import { endpoint_url } from "../assets/constants";
const ROW = "row";

export const DeleteModal = ({ rows, setRows, type, name }) => {
  const [confirmName, setConfirmName] = useState("");

  const closeModal = () => {
    document.getElementById("close-button").click();
  };

  const deleteRow = async () => {};

  const deleteFn = async () => {
    if (type === ROW) {
      return deleteRow();
    }
    closeModal();
  };

  return (
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">
              {type === ROW ? "Confirm Section Delete" : ""}
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
              {type === ROW ? (
                <>
                  Are you sure you want to delete section <b>{name}</b>. <br />
                  <br />
                  Type <b>{name}</b> to confirm delete.
                </>
              ) : (
                ""
              )}
            </p>
            <div>
              <input
                className="form-control"
                onChange={(e) => setConfirmName(e.target.value)}
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
            <button
              type="button"
              class="btn btn-danger"
              onClick={deleteFn}
              disabled={name !== confirmName}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
