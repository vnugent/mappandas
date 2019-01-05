import * as React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import GPSIcon from "@material-ui/icons/GpsFixedOutlined";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({});

export interface IProps {
  onClick: () => void;
}

export interface IState {}

class LocateMe extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div className="locate-me-container">
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
