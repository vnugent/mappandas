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

  _onDrawPointClick = () =>
    this.setState({ mode: "drawPoint" }, () =>
      this.props.onModeChange({
        prevMode: this.state.mode,
        currentMode: "drawPoint"
      })
    );
  _onEditButtonClick = () =>
    this.setState({ mode: "modify" }, () =>
      this.props.onModeChange({
        prevMode: this.state.mode,
        currentMode: "modify"
      })
    );

  render() {
    const { classes } = this.props;

    return (
      <div className="edittoolbar">
        <Button
          {...(this.state.mode === "drawPoint"
            ? { variant: "contained" }
            : { variant: "outlined" })}
          size="small"
          color="secondary"
          className={classes.margin}
          onClick={this._onDrawPointClick}
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
          {...(this.state.mode === "modify"
            ? { variant: "contained" }
            : { variant: "outlined" })}
          size="small"
          color="secondary"
          className={classes.margin}
          onClick={this._onEditButtonClick}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          className={classes.margin}
        >
          Delete
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(EditToolbar);
