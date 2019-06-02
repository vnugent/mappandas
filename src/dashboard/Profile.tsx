import React from "react";
import {
  TextField,
  Input,
  InputBase,
  FormControl,
  InputLabel,
  InputAdornment,
  Theme,
  createStyles,
  withStyles,
  Button
} from "@material-ui/core";
import AuthUser from "../types/AuthUser";

const styles = createStyles((theme: Theme) => ({
  root: {
    width: "600px",
    display: "flex",
    flexDirection: "column"
    //flexWrap: "wrap"
    //alignItems: "stretch"
  },
  formControl: {
    flexGrow: 1
  },

  input: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  }
}));

export interface IAppProps {
  classes: any;
  authUser: AuthUser;
  updateAuthUserAPI: (metadata) => void;
}

export interface IAppState {
  mutableAuthUser: AuthUser;
}

class Profile extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    const { authUser } = this.props;

    this.state = {
      mutableAuthUser: authUser
    };
  }

  render() {
    const { classes, authUser } = this.props;
    const { name2, email, about, publicUsername } = this.state.mutableAuthUser;
    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <TextField
            label="Name"
            className={classes.input}
            value={name2}
            variant="outlined"
            onChange={({ currentTarget }) =>
              this.handleChange({ name2: currentTarget.value })
            }
          />
        </FormControl>
        <TextField
          className={classes.input}
          label="About (optional)"
          value={about}
          variant="outlined"
          multiline={true}
          rows={3}
          rowsMax={3}
          onChange={({ currentTarget }) =>
            this.handleChange({ about: currentTarget.value })
          }
        />

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="component-simple">Email</InputLabel>
          <InputBase
            id="component-simple"
            className={classes.input}
            type="email"
            value={email}
            readOnly
          />
        </FormControl>

        <TextField
          className={classes.input}
          label="Your username"
          variant="outlined"
          value={publicUsername}
          onChange={({ currentTarget }) =>
            this.handleChange({ publicUsername: currentTarget.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                https://mappandas.com/@
              </InputAdornment>
            )
          }}
        />
        <Button
          onClick={this.onSaveClick}
          color="secondary"
          variant="contained"
          style={{ marginTop: "20px" }}
        >
          Save
        </Button>
      </form>
    );
  }

  handleChange = value => {
    const newState = { ...this.state.mutableAuthUser, value };
    this.setState({ mutableAuthUser: newState });
  };

  onSaveClick = () => {
    this.props.updateAuthUserAPI(this.state.mutableAuthUser);
  };
}

// const Profile = authUser => (
//   <AuthConsumer>
//     {({ user }) => (
//       <div>
//         <h2>User Profile</h2>
//         <ul>
//           <li>ID: {user.id}</li>
//           <li>Email: {user.email}</li>
//           <li>Role: {user.role}</li>
//         </ul>
//       </div>
//     )}
//   </AuthConsumer>
// );

export default withStyles(styles)(Profile);
