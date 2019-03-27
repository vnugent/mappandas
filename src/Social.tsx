import * as React from "react";
import { Button } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

const FB_ICON = (
  <svg width={24} height={24} viewBox="0 0 24 24">
    <path
      fill="#3b5998"
      d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z"
    />
  </svg>
);

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    }
  });
export interface IAppProps {
  uuid: string;
  classes: any;
}

const Social = (props: IAppProps) => (
  <Button
    style={{ marginTop: 5 }}
    variant="outlined"
    onClick={() => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=https://app.mappandas.com/p/${
          props.uuid
        }`,
        "_blank"
      );
    }}
  >
    Share on &nbsp;{FB_ICON}
  </Button>
);

export default withStyles(styles)(Social);
