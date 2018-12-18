import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  Input,
  Button,
  DialogActions
} from "@material-ui/core";

interface IProps {
  classes: any;
  description: string;
  editable: boolean;
  sharable: boolean;
  onShare: () => void;
  onDescriptionUpdate: (event: any) => void;
  onCancel: () => void;
}

interface IState {}

const styles = theme => ({
  root: {
    background: "#b2b9e1",
    margin: theme.spacing.unit
  },
  textField: {
    margin: theme.spacing.unit,
    padding: 5,
    background: "#f3f6cf",
    width: 500
  },
  roText: {
    width: 500,
    padding: 10
  },
  input: {
    color: "white"
  },
  menu: {
    width: 360
  },
  button: {
    margin: theme.spacing.unit * 1.2
  }
});

class PandaMetaEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { classes, editable } = this.props;

    return (
      <div className="description-container">
        <Paper className={classes.root} elevation={2}>
          {editable
            ? this.editableForm(this.props)
            : this.readOnlyText(this.props)}
        </Paper>
      </div>
    );
  }

  readOnlyText = ({ classes, description }) => ( !description ? null :  
    <div className={classes.roText}>
      <Typography variant="h4">
        {description}
      </Typography>
    </div>
  );

  editableForm = ({ classes, editable, description, sharable, onCancel }) => (
    <>
      <Input
        id="standard-name"
        placeholder="Describe this panda..."
        multiline={true}
        className={classes.textField}
        error={!description}
        value={description}
        disabled={!editable}
        onChange={this.props.onDescriptionUpdate}
        required={true}
        fullWidth={true}
        disableUnderline={true}
        inputProps={{
          rows: 4,
          rowsMax: 10
        }}
      />
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          disabled={!sharable}
          onClick={this.props.onShare}
        >
          Share
        </Button>
        <Button
          color="default"
          className={classes.button}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

export default withStyles(styles)(PandaMetaEditor);
