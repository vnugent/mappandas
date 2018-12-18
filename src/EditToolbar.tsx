import * as React from "react";
import { Button, Paper } from "@material-ui/core";
import { PinDropRounded } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { FeatureCollection } from "@turf/helpers";

const styles: any = theme => ({
  root: {
    background: "white",
    padding: 2,
    display: "flex",
    flexDirection: "column",
    width: 80
  },
  button: {
      color: "#ab003c",
      padding: 4
  }
});

interface IProps {
  classes: any;
  mode: string;
  onModeChange: (any) => void;
}

interface IState {
  mode: string;
  editBuffer: FeatureCollection;
  selectedFeatureIndexes: number[];
}

const EMPTY_FC: FeatureCollection = {
  type: "FeatureCollection",
  features: []
};

class EditToolbar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      mode: "drawPoint",
      editBuffer: EMPTY_FC,
      selectedFeatureIndexes: []
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="edittoolbar">
        <Paper className={classes.root} elevation={2}>
          <Button
            {...(this.props.mode === "drawPoint"
              ? { variant: "contained" }
              : { variant: "outlined" })}
            size="medium"
            color="secondary"
            className={classes.button}
            onClick={() =>
              this.props.onModeChange({
                prevMode: this.state.mode,
                currentMode: "drawPoint"
              })
            }
          >
            <PinDropRounded />
          </Button>
          {/* <Button
            variant="outlined"
            disabled={true}
            size="small"
            color="primary"
            className={classes.margin}
          >
            Polygon
          </Button> */}
          <Button
            {...(this.props.mode === "move"
              ? { variant: "contained" }
              : { variant: "outlined" })}
            size="medium"
            color="secondary"
            className={classes.button}
            onClick={() =>
              this.props.onModeChange({
                prevMode: this.state.mode,
                currentMode: "move"
              })
            }
          >
            Move
          </Button>
          <Button
            {...(this.props.mode === "deletePoint"
              ? { variant: "contained" }
              : { variant: "outlined" })}
            size="medium"
            color="secondary"
            className={classes.button}
            onClick={() =>
              this.props.onModeChange({
                prevMode: this.props.mode,
                currentMode: "deletePoint"
              })
            }
          >
            Delete
          </Button>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(EditToolbar);
