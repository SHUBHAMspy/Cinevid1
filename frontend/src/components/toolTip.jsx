import React from "react";

const ToolTip = (props) => {
  const { showToolTip } = props;
  return <div>{showToolTip && <div> Click to Sort</div>}</div>;
};

export default ToolTip;
