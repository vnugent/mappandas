import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { MoreVert } from "@material-ui/icons";
import {
  Menu,
  MenuItem,
  withStyles,
  createStyles,
  Theme,
  IconButton,
  Divider
} from "@material-ui/core";

import * as RestClient from "../RestClient";
import PreviewEntry from "./PreviewEntry";
import Can, { canPerform } from "../Can";
import { AuthConsumer } from "../authContext";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 2
    },
    entry: {
      display: "flex",
      flexDirection: "column"
    }
  });

export interface IAppProps extends RouteComponentProps {
  classes: any;
  authUser: any;
  ownerId: string;
}

export interface IAppState {
  posts: any[];
  anchorEl: any;
}

class Latest extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      posts: [],
      anchorEl: null
    };
  }

  componentDidMount() {
    this.fetchLatest();
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <p>Latest</p>
        {this.renderList()}
      </div>
    );
  }

  fetchLatest = () => {
    RestClient.getPostsByUser(this.props.ownerId)
      .then(posts => this.setState({ posts }))
      .catch(error => console.log(error));
  };

  renderList = () => {
    const { posts } = this.state;
    const canModified = this.checkPermissions();
    return posts.map(entry => (
      <PreviewEntry key={entry._id} entry={entry} canModified={canModified} />
    ));
  };

  checkPermissions = () => {
    const { authUser } = this.props;
    return canPerform({
      role: authUser.role,
      perform: "post:modify",
      data: {
        userId: authUser.textId,
        postOwnerId: this.props.ownerId
      }
    });
  };

  renderPostPreview = post => {
    const { classes } = this.props;
    const { title, content, uuid, _id } = post;
    return (
      <div key={_id} className={classes.entry}>
        <div>
          <h3 onClick={() => this.navigateToPost(_id)}>{title}</h3>
        </div>
        <div>Main photo</div>
        <div>{title}</div>
        {/* <p>{content.document.text.substring(0, 200)}</p> */}
      </div>
    );
  };

  navigateToPost = uuid => {
    const { history } = this.props;
    history.push(`/p/${uuid}`);
  };

  renderContextMenu = () => {
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
          id="simple-menu"
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
              this.setState({ anchorEl: null });
              //onCreateNewClick(true);
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            className={classes.hamburgerMenuItem}
            onClick={() => {
              this.setState({ anchorEl: null });
              //onCreateNewClick(true);
            }}
          >
            Delete
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
const LatestRR = withRouter(Latest);
export default withStyles(styles)(LatestRR);
