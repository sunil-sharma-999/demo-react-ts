import { Button, Card, Modal, Typography } from "@mui/material";
import classNames from "classnames";
import { ReactNode } from "react";
import modalStyles from "./modal.module.scss";

interface IProps {
  onClose: () => void;
  disabled?: boolean;
  children: ReactNode;
  onPrimary: () => void;
  onSecondary: () => void;
  loadingText: string;
  primaryText: string;
  secondaryText: string;
}

const ErrorModal = ({
  onClose,
  disabled,
  children,
  onPrimary,
  onSecondary,
  loadingText,
  primaryText,
  secondaryText,
}: IProps) => {
  return (
    <Modal open={true} onClose={onClose}>
      <Card className={modalStyles.modal_box}>
        <Typography variant="h6" component="h6" className={modalStyles.heading}>
          DELETE CONFIRMATION
        </Typography>
        <div className={modalStyles.data}>{children}</div>
        <div className={modalStyles.btns}>
          <Button
            color="primary"
            variant="contained"
            className={classNames(
              modalStyles.delete_btn,
              disabled ? "pointer-events-none" : ""
            )}
            onClick={() => {
              onPrimary();
            }}
          >
            {disabled ? loadingText : primaryText}
          </Button>
          <Button
            className={classNames(
              modalStyles.cancel_btn,
              disabled ? "pointer-events-none" : ""
            )}
            onClick={() => {
              onSecondary();
            }}
          >
            {secondaryText}
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default ErrorModal;
