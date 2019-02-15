import * as React from "react";
import { Input } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { FeatureCollection2 } from "@mappandas/yelapa";
import * as Yelapa from "@mappandas/yelapa";

import * as Config from "../Config";
import * as GeoHelper from "../GeoHelper";

const geocoder = new Yelapa.Geocoder(Config.MAPBOX_TOKEN);
export interface IAppProps {
  classes?: any;
  data: FeatureCollection2,
  onContentChange: (fc: FeatureCollection2) => void;
}

export interface IAppState {
  showHandleTooltip: boolean;
  raw: string;
  error: any;
  ast: any;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

export class PandaEditor extends React.Component<IAppProps, IAppState> {
  private textareaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      showHandleTooltip: false,
      raw: "",
      error: null,
      ast: { entries: [] }
    };
    this.textareaRef = React.createRef();
  }

  public render() {
    const { classes, data } = this.props;
    const initialStr = GeoHelper.geojson2string(data);
    return (
      <Input
        id="standard-name2"
        inputRef={this.textareaRef}
        placeholder="Describe this panda..."
        multiline={true}
        className={classes.textField}
        defaultValue={initialStr}
        //value={this.state.raw}
        onChange={evt => this.onChange(evt.target)}
        required={true}
        fullWidth={true}
        disableUnderline={true}
        inputProps={{
          rows: 25,
          rowsMax: 25
        }}
      />
    );
  }

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

  parseUserInput = (raw, cursor) => {
    geocoder
      .parse(raw)
      .then(({ ast, fc }) =>
        this.setState({ raw: raw, error: undefined }, () => {
          if (this.textareaRef.current != null) {
            this.textareaRef.current.selectionEnd = cursor;
          }
          if (this.props.onContentChange) {
            fc.bbox = GeoHelper.bboxFromGeoJson(fc);
            this.props.onContentChange(fc);
          }
        })
      )
      .catch((e: any) => this.setState({ raw: raw, error: e }));
  };
}

export default withStyles(styles)(PandaEditor);
