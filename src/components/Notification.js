import React from "react";

const Notification = ({ message }) => {
  console.log("message: ", message);
  if (message === null) {
    return null;
  } else if (message.type === "success") {
    return <div className="success">{message.content}</div>;
  } else if (message.type === "error") {
    return <div className="error">{message.content}</div>;
  }
};

export default Notification;
