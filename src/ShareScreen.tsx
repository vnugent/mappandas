import * as React from "react";
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  Typography,
  DialogContentText,
  DialogActions,
  IconButton,
  TextField,
  Button,
  createStyles,
  withStyles,
  WithStyles,
  Theme
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

//import classNames from "classnames";

import { IPanda } from "./types/CustomMapTypes";

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    content: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "fit-content"
    },
    title: {
      margin: 0,
      padding: spacing.unit * 2
    },
    closeButton: {
      position: "absolute",
      right: spacing.unit,
      top: spacing.unit
      //color: palette.grey[500]
    }
  });

interface Props extends WithStyles<typeof styles> {
  onClose: () => void;
  children: any;
}

const DialogTitle = withStyles(styles)((props: Props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

interface IProps {
  open: boolean;
  panda: IPanda;
  onClose: (any) => void;
  classes: any;
}

interface IState {
  copied: boolean;
}

class ShareScreen extends React.Component<IProps, IState> {
  private urlFieldRef: React.RefObject<HTMLInputElement>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      copied: false
    };
    this.urlFieldRef = React.createRef();
  }
  handleClose = () => {
    this.props.onClose({});
  };

  render() {
    const { classes, open, panda } = this.props;

    return (
      <Dialog
        open={open}
        aria-labelledby="simple-dialog-title"
        classes={classes.content}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle classes={classes} onClose={this.handleClose}>
          Share your Panda
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              inputRef={this.urlFieldRef}
              fullWidth={true}
              label="Panda URL"
              className={classes.textField}
              value={`https://mappandas.com/p/${panda.uuid}`}
              margin="normal"
              variant="outlined"
              contentEditable={false}
              onClick={this._copy}
            />
            <Button
              size="medium"
              color="primary"
              onClick={this._copy}
              className={classes.button}
            >
              {this.state.copied ? "Copied to clipboard" : "Copy to clipboard"}
            </Button>
          </DialogContentText>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              className={classes.button}
              onClick={() => this.props.onClose({ edit: true })}
            >
              Create new Panda
            </Button>
            <Button
              size="medium"
              className={classes.button}
              onClick={this.handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }

  _copy = () => {
    (this.urlFieldRef.current as HTMLInputElement).select();
    document.execCommand("copy");
    this.setState({ copied: true });
  };
}

export default ShareScreen;
