import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, DialogActions, Tooltip } from "@material-ui/core";
import { Close, KeyboardArrowLeft } from "@material-ui/icons";
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as Yelapa from "@mappandas/yelapa";
import * as GeoHelper from "./GeoHelper";
import * as Config from "./Config";
import FormatChecker from "./edit/FormatChecker";
import CardEditorWithPreview from "./panda/CardEditorWithPreview";

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
    height: "700px",
    background: "#778899",
    margin: 0,
    boxShadow: "1px 2px 4px 2px gray"
  },
  hideHandle: {
    margin: 0,
    cursor: "pointer",
    background: "#778899",
    borderRadius: "5px 5px 5px 5px",
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
  private textareaRef: React.RefObject<HTMLTextAreaElement>;
  constructor(props: IProps) {
    super(props);
    this.state = {
      showHandleTooltip: false,
      raw: "",
      error: null,
      ast: { entries: [] }
    };
    this.textareaRef = React.createRef();
  }

  render() {
    const { classes, editable, visible, data, sharable } = this.props;
    return (
      <div className="description-container">
        {visible && (
          <div className={classes.root}>
            <CardEditorWithPreview
              data={data}
              editable={editable}
              onContentChange={this.props.onEditUpdate}
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
                {/* <Button color="default" onClick={onCancel}>
                  Cancel Draw
                </Button> */}
              </div>
            </DialogActions>
          </div>
        )}
        <this.SidePanelHandle {...this.props} />
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
          <Close fontSize="large" />
        ) : (
          <KeyboardArrowLeft fontSize="large" />
        )}
      </div>
    </Tooltip>
  );

  parseUserInput = (raw, cursor) => {
    geocoder
      .parse(raw)
      .then(({ ast, fc }) =>
        this.setState({ raw: raw, error: undefined }, () => {
          if (this.textareaRef.current != null) {
            this.textareaRef.current.selectionEnd = cursor;
          }
          if (this.props.onEditUpdate) {
            fc.bbox = GeoHelper.bboxFromGeoJson(fc);
            this.props.onEditUpdate(fc);
          }
        })
      )
      .catch((e: any) => this.setState({ raw: raw, error: e }));
  };

  onChange = target => {
    let raw = target.value;
    // if (raw.length > 3 && raw.substring(raw.length - 3) === "\n--") {
    //   // if line begins with -- automatically jump to a new line
    //   raw = raw + "\n";
    // }
    const cursor = target.selectionStart;
    console.log("## cursor", cursor);
    this.parseUserInput(raw, cursor);
  };

  onKeyDown = event => {
    const cursor = event.target.selectionStart;

    let _raw = this.state.raw;
    if (event.keyCode == 8 && _raw.substring(_raw.length - 4) === "\n--\n") {
      // Backspace after -- will remove -- altogether
      const z = _raw.substring(0, _raw.length - 3);
      this.setState({ raw: z }, () => {
        if (this.textareaRef.current != null) {
          this.textareaRef.current.selectionEnd = cursor;
        }
      });
    }
  };

  onCheckStyle = () => {
    let cursor = 1;
    if (this.textareaRef.current) {
      cursor = this.textareaRef.current.selectionStart;
    }

    const raw = this.state.raw;
    if (
      raw.charAt(raw.length - 1) != "\n" &&
      this.state.ast.entries.length > 0
    ) {
      this.parseUserInput(raw.concat("\n--\n"), cursor);
    }
  };
}

export default withStyles(styles)(PandaMetaEditor);
