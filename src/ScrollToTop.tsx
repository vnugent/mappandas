import * as React from "react";
import { createStyles, Theme, Fab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ArrowUpward } from "@material-ui/icons";
import * as _ from "underscore";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "fixed",
      [theme.breakpoints.up("sm")]: {
        display: "none"
      },
      [theme.breakpoints.down("sm")]: {
        display: "block"
      },
      bottom: theme.spacing.unit,
      right: theme.spacing.unit,
      zIndex: 2000
    },
    extendedIcon: {
      marginRight: theme.spacing.unit
    }
  });

export interface IProps {
  classes?: any;
}

export interface IState {
  visible: boolean;
}

class ScrollToTop extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      visible: false
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.rock_n_roll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.rock_n_roll);
  }

  rock_n_roll = _.debounce(() => {
    const threshold = 400;
    this.setState({
      visible:
        document.documentElement.scrollTop > threshold ||
        document.body.scrollTop > threshold
    });
  }, 800);

  public render() {
    if (!this.state.visible) {
      return null;
    }
    const { classes } = this.props;
    return (
      <div
        className={classes.root}
        onClick={() => {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera;
        }}
      >
        <Fab
          variant="extended"
          aria-label="Up"
          color="secondary"
          className={classes.fab}
        >
          <ArrowUpward className={classes.extendedIcon} />
          Top
        </Fab>
      </div>
    );
  }
}

export default withStyles(styles)(ScrollToTop);
