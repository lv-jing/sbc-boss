import React from "react";

export interface LinkTargetProps {
  platform: string;
  target: boolean;
  onChange(isChecked): void;
}
export default class LinkTarget extends React.Component<LinkTargetProps, any> {
  render() {
    const { platform, target, onChange } = this.props;
    if (platform !== "pc") return null;
    return (
      <div className="ui-edit-content-bottom">
        <div className="ui-edit-content-bottom-content">
          <div className="checkBoxTeam">
            <input
              id="blankHref"
              name="blankHref"
              checked={target}
              onChange={e => onChange(!target)}
              className="cbox"
              type="checkbox"
            />
            <label htmlFor="blankHref" className="cboxInfo">
              在新标签页中打开
            </label>
          </div>
        </div>
      </div>
    );
  }
}
