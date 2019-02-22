import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";

import * as classNames from "classnames";
import { FeatureCollection2 } from "@mappandas/yelapa";

export interface IAppProps {
  data: FeatureCollection2;
  hide?: boolean;
  previewMode?: boolean;
  classes?: any;
}

export interface IAppState {}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflow: "auto",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      marginTop: "15px",
      //paddingTop: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
      backgroundColor: "#e0f2f1"
    },
    shareMode: {
      backgroundColor: "white",
      boxSizing: "border-box",
      paddingLeft: theme.spacing.unit * 3
    }
  });

class PandaCardView extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { properties, features } = this.props.data;
    const { classes, previewMode, hide } = this.props;
    const clz = previewMode ? undefined : classes.shareMode;
    const hideAttr = hide ? "none" : "block";
    return (
      <div
        className={classNames("style-4", classes.root, clz)}
        style={{
          display: hideAttr
        }}
      >
        <Typography variant="h4" color="textPrimary" gutterBottom>
          {properties && properties.title}
        </Typography>

        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {properties && properties.summary}
        </Typography>
        <this.FeatureList features={features} />
      </div>
    );
  }

  FeatureList = ({ features }) => {
    return features.map((feature, index) => {
      const p = feature.properties;
      if (p) {
        return (
          <div key={index} style={{ marginTop: "28px" }}>
            <Typography variant="h6">{p.name && p.name}</Typography>
            <Typography component="div" variant="body1" paragraph={true}>
              <this.Paragraph mlines={p.description} />
            </Typography>
          </div>
        );
      }
      return null;
    });
  };

  Paragraph = ({ mlines }) => {
    if (!mlines) return null;
    return mlines.map((line: string, index: number) => {
      return <div key={index}>{line}</div>;
    });
  };
}

export default withStyles(styles)(PandaCardView);
