import * as React from "react";
import { IconButton, Tooltip, createStyles, Theme } from "@material-ui/core";
import GPSIcon from "@material-ui/icons/GpsFixedOutlined";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      [theme.breakpoints.up("sm")]: {
        display: "flex"
      },
      [theme.breakpoints.down("sm")]: {
        display: "none"
      },
      float: "right",
      backgroundColor: "#778899",
      boxShadow: "1px 2px 4px 2px gray",
      borderRadius: "6px 14px 8px",
      right: 5,
      width: 58,
      zIndex: 2000,
      opacity: 0.88
    }
  });

export interface IProps {
  classes?: any;
  onClick: () => void;
}

export interface IState {}

class LocateMe extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const { classes } = this.props;
    return (
      <div
        className={classes.root}
        style={{
          top: window.innerHeight - 80
        }}
      >
        <Tooltip title="Move map to your location" placement="left">
          <IconButton onClick={this.props.onClick}>
            <GPSIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(LocateMe);
