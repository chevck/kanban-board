import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { delete_row } from "../redux/reducers";

const ROW = "row";

export const DeleteModal = ({ type, name, id }) => {
  const [confirmName, setConfirmName] = useState("");
  const dispatch = useDispatch();

  const closeModal = () => {
    document.getElementById("delete-close-button").click();
  };

  const deleteRow = async () => {
    dispatch(delete_row({ id }));
  };

  const deleteFn = async () => {
    if (type === ROW) {
      deleteRow();
    }
    closeModal();
  };

  return (
    <div
      className="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteModalLabel">
              {type === ROW ? "Confirm Section Delete" : ""}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              id="delete-close-button"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
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
