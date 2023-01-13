import React from "react";
import LinkChoose from "./link-choose";
import ImageChoose from "./image-choose";
import getLinkConfig from "./common/linkConfig";

export default class DialogChooseUnit extends React.Component<any, any> {
  static getLinkConfig = getLinkConfig;
  render() {
    const { platform, systemCode, apiHost, PageService } = this.props;
    return (
      <div id="DialogChooseUnit">
        <LinkChoose
          platform={platform}
          systemCode={systemCode}
          apiHost={apiHost}
          PageService={PageService}
        />
        <ImageChoose />
      </div>
    );
  }
}
