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
  initialText: string;
  onContentChange: (fc: FeatureCollection2) => void;
}

export interface IAppState {
  initialText: string;
  raw: string;
  error: any;
  ast: any;
}

export class PandaEditor extends React.Component<IAppProps, IAppState> {
  private textareaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: IAppProps) {
    super(props);
    this.state = this.state0();
    this.textareaRef = React.createRef();
  }

  state0 = () => ({
    initialText: this.props.initialText,
    raw: this.props.initialText,
    error: null,
    ast: { entries: [] }
  });

  componentDidMount() {
    this.parseUserInput(this.state.initialText, 1);
  }

  public render() {
    const { hide, data } = this.props;
    const hideAttr: string = hide ? "none" : "flex";
    if (!hide && this.textareaRef.current) {
      this.textareaRef.current.focus();
    }

    const uuid = data.properties ? data.properties.uuid : "1";

    return (
      <textarea
        key={uuid}
        placeholder="Begin writing your story here.  Click 'Try Me' to see an example."
        autoFocus={true}
        defaultValue={this.state.initialText}
        onChange={evt => this.onChange(evt.target)}
        onPaste={evt => this.onPaste(evt)}
        //required={true}
        className="style-4"
        ref={this.textareaRef}
        style={{
          fontSize: "1.2em",
          lineHeight: 1.8,
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
    // if (raw.length > 3 && raw.substring(raw.length - 3) === "\n--") {
    //   // if line begins with -- automatically jump to a new line
    //   raw = raw + "\n";
    // }
    const cursor = target.selectionStart;
    this.parseUserInput(raw, cursor);
  };

  parseUserInput = (raw, cursor) => {
    const { properties } = this.props.data;

    if (!raw) {
      this.setState(this.state0(), () => {
        // combine this with normal case once geocoder.parse()
        // doesn't generate error on "" input
        if (this.props.onContentChange) {
          const fc = GeoHelper.NEW_FC();
          if (properties && properties.uuid) {
            fc.properties.uuid = properties.uuid;
          }
          this.props.onContentChange(fc);
        }
      });
      return;
    }
    geocoder
      .parse(raw)
      .then(({ ast, fc }) =>
        this.setState({ raw: raw, error: undefined }, () => {
          //   if (this.textareaRef.current != null) {
          //     this.textareaRef.current.selectionEnd = cursor;
          //   }
          if (this.props.onContentChange) {
            if (properties && properties.uuid) {
              fc.properties.uuid = properties.uuid;
            }
            fc.bbox = GeoHelper.bboxFromGeoJson(fc);
            this.props.onContentChange(fc);
          }
        })
      )
      .catch((e: any) => this.setState({ raw: raw, error: e }));
  };
}

export default PandaEditor;
