import * as React from "react";

import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

export interface IAppProps {
  classes: any;
  currentStyle: string;
  onChange: (string) => void;
}

export interface IAppState {}

class Switcher extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  _handleChange = e => {
    this.props.onChange(e.target.value);
  };

  public render() {
    const { classes } = this.props;

    return (
      <div className="map-switcher-container">
        <RadioGroup
          aria-label="Gender"
          name="gender1"
          className={classes.group}
          value={this.props.currentStyle}
          onChange={this._handleChange}
          row
        >
          <FormControlLabel
            value="streets-v10"
            control={<Radio color="secondary" />}
            label="Street"
            labelPlacement="top"
          />
          <FormControlLabel
            value="light-v9"
            control={<Radio color="secondary" />}
            label="Light"
            labelPlacement="top"
          />
          <FormControlLabel
            value="satellite-streets-v10"
            control={<Radio color="secondary" />}
            label="Satellite"
            labelPlacement="top"
          />
          <FormControlLabel
            value="outdoors-v10"
            control={<Radio color="secondary" />}
            label="Outdoors"
            labelPlacement="top"
          />
        </RadioGroup>
      </div>
    );
  }
}

export default withStyles(styles)(Switcher);
