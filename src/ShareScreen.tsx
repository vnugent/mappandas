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
  //Paper,
  createStyles,
  withStyles,
  WithStyles,
  Theme
} from "@material-ui/core";
import { AssignmentReturnOutlined as CopyIcon } from "@material-ui/icons";
import { Close as CloseIcon } from "@material-ui/icons";

//import classNames from "classnames";

import { IPanda } from "./types/CustomMapTypes";

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    content: {
      display: "flex",
      flexDirection: "column",
      paddingTop: spacing.unit * 2,
      margin: 0,
      justifyContent: "center",
      //alignItems: "stretch"
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
      marginTop: spacing.unit * 3.5,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: 0,
      padding: spacing.unit * 2.5,
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
  private interval: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      copied: false
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
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
            contentEditable={false}
            variant="outlined"
            label="Unique link"
            fullWidth={true}
            value={`https://mappandas.com/p/${panda.uuid}`}
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
          <Typography variant="h4">DON'T LOSE YOUR PANDA!</Typography>
          <TextField
            fullWidth={true}
            label="Email"
            className={classes.textField}
            value=""
            margin="normal"
            autoFocus={true}
            //variant="outlined"
            contentEditable={true}
            onClick={() => this.props.onClose({ edit: true })}
          />
          <Button
            variant="contained"
            color="primary"
            size="medium"
            fullWidth={true}
            className={classes.emailButton}
            onClick={() => this.props.onClose({ edit: true })}
          >
            Email me this panda
          </Button>
          <Typography variant="caption" className={classes.emailFootnote}>
            We do not share your email with third parties
          </Typography>
        </DialogActions>
      </Dialog>
    );
  }

  _copy = () => {
    (this.urlFieldRef.current as HTMLInputElement).select();
    document.execCommand("copy");
    this.setState({ copied: true });
  };
}

export default withStyles(styles)(ShareScreen);
