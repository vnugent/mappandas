import * as React from "react";
import * as _ from "underscore";
import { FeatureCollection2 } from "@mappandas/yelapa";
import * as Yelapa from "@mappandas/yelapa";

import * as Config from "../Config";
import * as GeoHelper from "../GeoHelper";

const geocoder = new Yelapa.Geocoder(Config.MAPBOX_TOKEN);
export interface IAppProps {
  classes?: any;
  hide: boolean;
  data: FeatureCollection2;
  onContentChange: (fc: FeatureCollection2) => void;
}

export interface IAppState {
  raw: string;
  error: any;
  ast: any;
}

export class PandaEditor extends React.Component<IAppProps, IAppState> {
  private textareaRef: React.RefObject<HTMLTextAreaElement>;
  //private timer: any;

  constructor(props: IAppProps) {
    super(props);
    this.state = this.state0();
    this.textareaRef = React.createRef();
  }

  state0 = () => ({
    raw: "",
    error: null,
    ast: { entries: [] }
  });

  componentDidMount() {
    //this.timer = setInterval(this.checkEOF, 20000);
  }

  componentWillUnmount() {
//    clearInterval(this.timer);
  }

  public render() {
    const { data, hide } = this.props;
    const hideAttr: string = hide ? "none" : "flex";
    if (!hide &&  this.textareaRef.current) {
        console.log("###focus");
        this.textareaRef.current.focus();
    }

    const initialStr = this.checkEOF(GeoHelper.geojson2string(data).trim());
    return (
      <textarea
        id="standard-name2"
        placeholder="Describe this panda..."
        autoFocus={true}
        defaultValue={initialStr}
        onChange={evt => this.onChange(evt.target)}
        onPaste={evt => this.onPaste(evt)}
        required={true}
        className="style-4"
        ref={this.textareaRef}
        style={{
          fontSize: "1.2em",
          border: "none",
          outline: "none",
          borderColor: "transparent",
          backgroundColor: "white",
          display: hideAttr,
          flexGrow: 1,
          overflow: "auto",
          caretColor: "blue",
          height: "70%",
          width: "100%",
          resize: "none",
          boxSizing: "border-box",
          marginTop: "15px",
          paddingRight: "10px"
        }}
        rows={8}
      />
    );
  }

  checkEOF = (val: string) => {
    if (val && val.length > 2 && val.charAt(val.length - 1) != "\n") {
      return val + "\n";
    }
    return val;
  };

  fixOEF = () => {
    const { raw } = this.state;
    this.parseUserInput(this.checkEOF(raw), raw.length);
  };

  onPaste = evt => {
    _.delay(this.fixOEF, 800);
  };

  onChange = target => {
    let raw = target.value;
    console.log("##onChange", raw);
    // if (raw.length > 3 && raw.substring(raw.length - 3) === "\n--") {
    //   // if line begins with -- automatically jump to a new line
    //   raw = raw + "\n";
    // }
    const cursor = target.selectionStart;
    this.parseUserInput(raw, cursor);
  };

  parseUserInput = (raw, cursor) => {
    if (!raw) {
      this.setState(this.state0(), () => {
        // combine this with normal case once geocoder.parse()
        // doesn't generate error on "" input
        if (this.props.onContentChange) {
          this.props.onContentChange(GeoHelper.NEW_FC());
        }
      });
      return;
    }
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

export default PandaEditor;
