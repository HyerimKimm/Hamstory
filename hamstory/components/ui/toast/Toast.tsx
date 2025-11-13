"use client";

import React from "react";
import { ToastContainer, Zoom } from "react-toastify";

import "./ToastifyCustom.scss";

const Toast = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      transition={Zoom}
      hideProgressBar={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={true}
      pauseOnHover={false}
      theme="light"
    />
  );
};

export default Toast;
