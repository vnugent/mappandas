import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Input,
  Button,
  DialogActions,
  Tooltip
} from "@material-ui/core";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@material-ui/icons";

interface IProps {
  classes: any;
  description: string;
  editable: boolean;
  sharable: boolean;
  visible: boolean;
  onShare: () => void;
  onDescriptionUpdate: (event: any) => void;
  onShowHideFn: () => void;
  onCancel: () => void;
}

interface IState {
  showHandleTooltip: boolean;
}

const styles = theme => ({
  root: {
    background: "#778899",
    margin: 0,
    boxShadow: "1px 2px 4px 2px gray"
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
  hideHandle: {
    margin: 0,
    cursor: "pointer",
    background: "#778899",
    borderRadius: "5px 0px 0px 5px",
    zIndex: 2000
  },
  container: {
    display: "flex"
  }
});

class PandaMetaEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showHandleTooltip: false
    };
  }

  render() {
    const { classes, editable, visible } = this.props;
    return (
      <div className="description-container">
        <this.SidePanelHandle {...this.props} />
        {visible && (
          <div className={classes.root}>
            {editable
              ? this.editableForm(this.props)
              : this.readOnlyText(this.props)}
          </div>
        )}
      </div>
    );
  }

  SidePanelHandle = ({ visible, classes, onShowHideFn }) => (
    <Tooltip
      title={visible ? "Collapse side panel" : "Expand side pandel"}
      placement="left"
      open={this.state.showHandleTooltip}
      onClose={()=>(this.setState({showHandleTooltip: false}))}
      onOpen={()=>(this.setState({showHandleTooltip: true}))}
    >
      <div
        className={classes.hideHandle}
        aria-label={visible ? "Collapse side panel" : "Expand side pandel"}
        onClick={() =>
          this.setState({ showHandleTooltip: false }, onShowHideFn)
        }
      >
        {visible ? (
          <KeyboardArrowRight fontSize="large" />
        ) : (
          <KeyboardArrowLeft fontSize="large" />
        )}
      </div>
    </Tooltip>
  );

  readOnlyText = ({ classes, description }) =>
    !description ? null : (
      <div className={classes.roText}>
        <Typography variant="h4">{description}</Typography>
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
        <Button color="default" onClick={onCancel}>
          Cancel Draw
        </Button>
      </DialogActions>
    </>
  );
}

export default withStyles(styles)(PandaMetaEditor);
