import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

interface IProps {
  classes: any;
  description: string;
  mode: string;
  onDescriptionUpdate: (event: any) => void;
}

interface IState {}

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
    background: "#fff",
  },
  dense: {
    marginTop: 19
  },
  input: {
    color: "white"
  },
  menu: {
    width: 360
  }
});

class PandaMetaEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <form noValidate autoComplete="off">
        <TextField
          id="standard-name"
          placeholder="Describe this panda..."
          className={classes.textField}
          error={!this.props.description}
          value={this.props.description}
          disabled={this.props.mode === "edit" ? false : true}
          onChange={this.props.onDescriptionUpdate}
          required={true}
          inputProps={{
            maxLength: 300
          }}
        />
      </form>
    );
  }
}

export default withStyles(styles)(PandaMetaEditor);
