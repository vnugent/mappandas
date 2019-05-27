import * as React from "react";
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {},
  children: {},
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2
  }
});

class ResponsiveLayout extends React.Component {
  render() {
    const { classes, children } = this.props;
    return (
      <Grid
        className={classes.root}
        container
        direction="column"
        alignItems="center"
        justify="center"
        wrap="wrap"
      >
        <Grid item={true} wrap="wrap" xs={12} className={classes.children}>
          {children}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ResponsiveLayout);
