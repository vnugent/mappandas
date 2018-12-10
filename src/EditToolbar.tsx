import * as React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { FeatureCollection } from "@turf/helpers";

const styles: any = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexShrink: "1",
    maxWidth: 80,
    zIndex: 1000
  },
  chip: {
    margin: theme.spacing.unit
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
        <Button
          {...(this.props.mode === "drawPoint"
            ? { variant: "contained" }
            : { variant: "outlined" })}
          size="small"
          color="secondary"
          className={classes.margin}
          onClick={() =>
            this.props.onModeChange({
              prevMode: this.state.mode,
              currentMode: "drawPoint"
            })
          }
        >
          Point
        </Button>
        <Button
          variant="outlined"
          disabled={true}
          size="small"
          color="primary"
          className={classes.margin}
        >
          Polygon
        </Button>
        <Button
          {...(this.props.mode === "move"
            ? { variant: "contained" }
            : { variant: "outlined" })}
          size="small"
          color="secondary"
          className={classes.margin}
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
          size="small"
          color="secondary"
          className={classes.margin}
          onClick={() =>
            this.props.onModeChange({
              prevMode: this.props.mode,
              currentMode: "deletePoint"
            })
          }
        >
          Delete
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(EditToolbar);
