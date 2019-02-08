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
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as Yelapa from "@mappandas/yelapa";
import * as GeoHelper from "./GeoHelper";
import * as Config from "./Config";
import FormatChecker from "./edit/FormatChecker";

const geocoder = new Yelapa.Geocoder(Config.MAPBOX_TOKEN);

interface IProps {
  data: FeatureCollection2;
  classes: any;
  editable: boolean;
  sharable: boolean;
  visible: boolean;
  onShare: () => void;
  onEditUpdate: (fc: FeatureCollection2) => void;
  onShowHideFn: () => void;
  onCancel: () => void;
}

interface IState {
  showHandleTooltip: boolean;
  raw: string;
  error: any;
  ast: any;
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
    background: "#FBFBEF",
    width: 500,
    font: "Georgia, serif"
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
  },
  actionContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

class PandaMetaEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showHandleTooltip: false,
      raw: "",
      error: null,
      ast: {entries: []}
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
      onClose={() => this.setState({ showHandleTooltip: false })}
      onOpen={() => this.setState({ showHandleTooltip: true })}
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

  readOnlyText = ({ classes, data }) =>
    !data.properties.description ? null : (
      <div className={classes.roText}>
        <Typography variant="h4">{data.properties.description}</Typography>
      </div>
    );

  editableForm = ({ classes, editable, data, sharable, onCancel }) => (
    <>
      <Input
        id="standard-name"
        placeholder="Describe this panda..."
        multiline={true}
        className={classes.textField}
        //error={!description}
        value={this.state.raw}
        disabled={!editable}
        //onChange={this.props.onEditUpdate}
        onChange={evt => this.onChange(evt.target.value)}
        required={true}
        fullWidth={true}
        disableUnderline={true}
        inputProps={{
          rows: 25,
          rowsMax: 25
        }}
        onKeyDown={this.onKeyDown}
      />
      <DialogActions className={classes.actionContainer}>
        <FormatChecker
          error={this.state.error}
          onCheckStyle={this.onCheckStyle}
        />
        <div>
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
        </div>
      </DialogActions>
    </>
  );

  parseUserInput = raw =>
    geocoder
      .parse(raw)
      .then(({ ast, fc }) =>
        this.setState({ raw: raw, error: undefined }, () => {
          if (this.props.onEditUpdate) {
            fc.bbox = GeoHelper.bboxFromGeoJson(fc);
            this.props.onEditUpdate(fc);
          }
        })
      )
      .catch((e: any) => this.setState({ raw: raw, error: e }));

  onChange = raw => {
    console.log("onChange raw", raw);
    if (raw.length > 3 && raw.substring(raw.length - 3) === "\n--") {
      // if line begins with -- automatically jump to a new line
      raw = raw + "\n";
    }
    this.parseUserInput(raw);
  };

  onKeyDown = event => {
    let _raw = this.state.raw;
    if (event.keyCode == 8 && _raw.substring(_raw.length - 4) === "\n--\n") {
      // Backspace after -- will remove -- altogether
      const z = _raw.substring(0, _raw.length - 3);
      this.setState({ raw: z });
    }
  };

  onCheckStyle = () => {
    const raw = this.state.raw;
    if (raw.charAt(raw.length - 1) != "\n" && this.state.ast.entries.length > 0) {
      console.log("last char");
      this.parseUserInput(raw.concat("\n--\n"));
      //this.setState({ raw: raw.concat("\n--") });
    }
  };
}

export default withStyles(styles)(PandaMetaEditor);
