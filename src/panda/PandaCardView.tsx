import * as React from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FeatureCollection2 } from "@mappandas/yelapa";

export interface IAppProps {
  data: FeatureCollection2;
}

export interface IAppState {}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class PandaCardView extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { properties, features } = this.props.data;
    return (
      <div style={{ overflow: "hidden" }}>
        <div style={{overflow: "auto"}}>
          <Typography variant="h5" color="textPrimary" gutterBottom>
            {properties && properties.title}
          </Typography>

          <Typography variant="subtitle2" gutterBottom>
            {properties && properties.summary}
          </Typography>
          <this.FeatureList features={features} />
        </div>
      </div>
    );
  }

  FeatureList = ({ features }) => {
    return features.map(feature => {
      const p = feature.properties;
      if (p) {
        return (
          <div style={{ marginTop: "28px" }}>
            <Typography variant="h6">{p.name && p.name}</Typography>
            <Typography variant="body1">
              <this.Paragraph mlines={p.description} />
            </Typography>
          </div>
        );
      }
      return null;
    });
  };

  Paragraph = ({ mlines }) => {
    return mlines.map(line => {
      return <p>{line}</p>;
    });
  };
}

export default withStyles(styles)(PandaCardView);
