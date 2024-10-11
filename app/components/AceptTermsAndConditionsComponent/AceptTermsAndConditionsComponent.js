import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const AceptTermsAndConditionsComponent = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (value) => {
    props.setStreamingStatus(value);
    props.setModalTerms(false);
  };

  return (
    <>
      <Dialog
        open={props.modalTerms}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Accept this terms and conditions"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            I own all the rights to the film{" "}
            {props?.finalData?.movie?.detalle?.["Project Title"]},{" "}
            {
              props?.finalData?.movie?.detalle[
                "Project Title (Original Language)"
              ]
            }
            , {props?.finalData?.movie?.detalle?.["Directors"]}, and I authorize
            its screening for the Girona Film Festival Streaming, Emergent
            platform. I have the authority to do so
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose("0");
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              handleClose("1");
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AceptTermsAndConditionsComponent;
