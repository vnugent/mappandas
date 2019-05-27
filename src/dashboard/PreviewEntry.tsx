import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  Card,
  CardMedia,
  Theme,
  withStyles,
  createStyles,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

import * as SlateHelper from "../SlateHelper";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      backgroundColor: "#fafafa",
      marginTop: theme.spacing.unit * 4,
      maxWidth: 600
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    contextMenu: {
      padding: theme.spacing.unit * 4
    }
  });

export interface IAppProps extends RouteComponentProps {
  classes: any;
  entry: any;
  canModified: boolean;
}

export interface IAppState {
  anchorEl: any;
}

class PreviewEntry extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  render() {
    const { classes, canModified } = this.props;
    const { title, _id, data, insert_ts } = this.props.entry;
    const imageUrl = "img/someimage.png";
    const ts = new Date(insert_ts * 1000).toLocaleDateString();
    return (
      <Card className={classes.card} key={_id}> 
        <CardHeader action={canModified ? this.renderContextMenu(_id) : null} subheader={ts} />
        {/* <CardMedia className={classes.media} image={imageUrl} title={title} /> */}
        <CardContent
          className={classes.content}
          onClick={() => this.navigateToPost(_id)}
        >
          <Typography gutterBottom variant="h5" component="h5">
            {title}
          </Typography>
          <Typography gutterBottom variant="body1">
            {SlateHelper.getPreviewText(data)}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  navigateToPost = (uuid: string, edit?: boolean) => {
    const { history } = this.props;
    history.push(`/p/${uuid}${edit ? "/edit" : ""}`);
  };

  renderContextMenu = (uuid: string) => {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          aria-label="More"
          //aria-owns={open ? "long-menu" : undefined}
          aria-haspopup="true"
          color="secondary"
          onClick={this.handleClick}
        >
          <MoreVert fontSize="small" />
        </IconButton>
        <Menu
          disableAutoFocusItem={true}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <MenuItem
            className={classes.hamburgerMenuItem}
            onClick={() => {
              this.setState({ anchorEl: null }, () =>
                this.navigateToPost(uuid, true)
              );
              //onCreateNewClick(true);
            }}
          >
            Edit story
          </MenuItem>
          <MenuItem
            className={classes.hamburgerMenuItem}
            onClick={() => {
              this.setState({ anchorEl: null }, () =>
                this.navigateToPost(uuid, true)
              );

              //onCreateNewClick(true);
            }}
          >
            Delete story
          </MenuItem>
        </Menu>
      </div>
    );
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
}

export default withStyles(styles)(withRouter(PreviewEntry));
