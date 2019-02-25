import * as React from "react";
import { Button, Typography } from "@material-ui/core";
import { PetsTwoTone as PetIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";

//import SvgIcon from "@material-ui/core/SvgIcon";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    margin: theme.spacing.unit * 1
  },
  ok: {
    color: green[800]
  }
});

// const _ERROR_ICON = ({ classes }) => (
//   <SvgIcon className={classes.icon} color="error">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//     >
//       <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z" />
//     </svg>{" "}
//   </SvgIcon>
// );

// const ERROR_ICON = withStyles(styles)(_ERROR_ICON);

export interface IAppProps {
  error: any;
  classes: any;
  onCheckStyle: () => void;
}

export interface IAppState {}

export class FormatChecker extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }
  s;

  public render() {
    const { error, classes, onCheckStyle } = this.props;
    const errorExists: boolean = error && error.message;
    return (
      <div className={classes.root}>
        <Button
          disabled={!errorExists}
          size="small"
          className={classes.margin}
          onClick={onCheckStyle}
        >
          Style check
        </Button>
        {errorExists ? (
          <PetIcon className={classes.icon} />
        ) : (
          <Typography variant="h6" className={classes.ok}>OK</Typography>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(FormatChecker);
