"use client";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingScreenComponent = () => {
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
        onClick={null}
      >
        <div className=" text-center">
          <CircularProgress color="inherit" /> <br />
          Loading data. Please wait...
        </div>
      </Backdrop>
    </>
  );
};

export default LoadingScreenComponent;
