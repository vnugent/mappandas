import * as React from "react";
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  createStyles,
  withStyles,
  WithStyles,
  Theme
} from "@material-ui/core";
import { AssignmentReturnOutlined as CopyIcon } from "@material-ui/icons";
import { Close as CloseIcon } from "@material-ui/icons";
import * as Validator from "validate.js";

import { IPanda } from "./types/CustomMapTypes";
import * as RestClient from "./RestClient";

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    content: {
      display: "flex",
      flexDirection: "column",
      paddingTop: spacing.unit * 2,
      margin: 0,
      justifyContent: "space-between",
      alignItems: "center"
    },
    title: {
      margin: 0,
      padding: spacing.unit * 2
    },
    closeButton: {
      position: "absolute",
      right: spacing.unit,
      top: spacing.unit,
      color: palette.grey[500]
    },
    action1: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: 0,
      padding: spacing.unit * 4,
      background: palette.secondary.light
    },
    urlBox: {},
    copyButton: {
      margin: 0,
      padding: 0,
      cursor: "pointer"
    },
    emailButton: {
      margin: 0,
      flexGrow: 2
    },
    emailFootnote: {
      marginTop: spacing.unit * 2
    }
  });

const emailConstraint = {
  from: {
    email: true
  }
};

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
  email: string;
  isEmailValid: boolean;
  sendingInProgress: boolean;
}

class ShareScreen extends React.Component<IProps, IState> {
  private urlFieldRef: React.RefObject<HTMLInputElement>;
  private interval: any;
  private emailSentInterval: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      copied: false,
      email: "",
      isEmailValid: false,
      sendingInProgress: false
    };
    this.urlFieldRef = React.createRef();
  }

  componentDidMount() {
    // auto reset copy text change
    this.interval = setInterval(() => {
      if (this.state.copied) {
        this.setState({ copied: false });
      }
    }, 6000);

    // auto reset sending progress
    this.emailSentInterval = setInterval(() => {
      if (this.state.sendingInProgress) {
        this.setState({ sendingInProgress: false });
      }
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.emailSentInterval);
  }

  handleClose = () => {
    this.props.onClose({});
  };

  render() {
    const { classes, open, panda } = this.props;
    const emailHelperText =
      this.state.isEmailValid || this.state.email.length == 0
        ? " "
        : "Invalid email format";
    return (
      <Dialog
        open={open}
        aria-labelledby="simple-dialog-title"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle classes={classes} onClose={this.handleClose}>
          Share your Panda
        </DialogTitle>
        <DialogContent className={classes.content}>
          <TextField
            id="input-with-icon-textfield"
            className={classes.urlBox}
            variant="outlined"
            label="Unique link"
            fullWidth={true}
            margin="normal"
            value={`https://app.mappandas.com/p/${panda.uuid}`}
            onClick={this._copy}
            inputRef={this.urlFieldRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CopyIcon
                    onClick={this._copy}
                    className={classes.copyButton}
                  />
                </InputAdornment>
              )
            }}
          />
          <Typography variant="caption">
            {this.state.copied
              ? "Copied to clipboard!"
              : "Click link to copy to clipboard"}
          </Typography>
        </DialogContent>
        <DialogActions className={classes.action1}>
          <Typography variant="h4" gutterBottom>
            DON'T LOSE YOUR PANDA!
          </Typography>
          <TextField
            fullWidth={true}
            className={classes.textField}
            placeholder="Email"
            value={this.state.email}
            error={!this.state.isEmailValid}
            autoFocus={true}
            onChange={this._validate_email}
            helperText={emailHelperText}
          />
          <Button
            disabled={!this.state.isEmailValid || this.state.sendingInProgress}
            variant="contained"
            color="primary"
            size="medium"
            fullWidth={true}
            className={classes.emailButton}
            onClick={this._onSendEmailClick}
          >
            {this.state.sendingInProgress
              ? "Sending..."
              : "Email me this panda"}
          </Button>
          <Typography variant="caption" className={classes.emailFootnote}>
            We do not share your email with third parties
          </Typography>
        </DialogActions>
      </Dialog>
    );
  }

  _validate_email = e => {
    const emailText = e.target.value;
    const errorObj = Validator.validate({ from: emailText }, emailConstraint);

    this.setState({ email: emailText, isEmailValid: !errorObj });
  };

  _copy = () => {
    (this.urlFieldRef.current as HTMLInputElement).select();
    document.execCommand("copy");
    this.setState({ copied: true });
  };

  _onSendEmailClick = () => {
    const { uuid } = this.props.panda;
    // send email is really async. here we fake progress by setting
    // reseting progress by a timer
    this.setState({ sendingInProgress: true });
    RestClient.sendMail(uuid, this.state.email);
  };
}

export default withStyles(styles)(ShareScreen);
