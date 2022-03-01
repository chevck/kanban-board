import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetch_ticket } from "../redux/reducers";
import { getTicket } from "../redux/selectors";

export const ViewTicket = ({ id }) => {
  const dispatch = useDispatch();
  const ticket = useSelector(getTicket);

  const openModal = () => {
    document.getElementById("openModal").click();
  };

  useEffect(() => {
    if (id) {
      dispatch(fetch_ticket({ id }));
      openModal();
    }
  }, [id, dispatch]);

  return (
    <div
      class="modal fade"
      id="viewTicketModal"
      tabindex="-1"
      aria-labelledby="viewTicketModalLabel"
      aria-hidden="true"
    >
      <p
        data-bs-toggle="modal"
        data-bs-target="#viewTicketModal"
        id="openModal"
      ></p>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewTicketModalLabel">
              Ticket #{id}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <b>{ticket.summary}</b>
            <br />
            <br />
            <p>{ticket.description}</p>
            This ticket is a <span>{ticket.tag}</span> ticket
          </div>
        </div>
      </div>
    </div>
  );
};
