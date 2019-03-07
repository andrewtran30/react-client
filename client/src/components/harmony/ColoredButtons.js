import React from "react";

import Config from "Config";

import RemoteButton from "components/common/RemoteButton";
import { Row, ButtonGroup } from "react-bootstrap";

export default ({ style, device, commands }) => {
  if (!device || !commands || !commands.Yellow) {
    return null;
  }
  const command_topic = Config.mqtt.harmony + "/" + device + "/set/device/";

  return (
    <Row style={style}>
      <ButtonGroup>
        <RemoteButton
          bsStyle="warning"
          topic={command_topic + commands.Yellow.action.deviceId}
          message={commands.Yellow.name}
        >
          Yellow
        </RemoteButton>
        <RemoteButton
          bsStyle="info"
          topic={command_topic + commands.Blue.action.deviceId}
          message={commands.Blue.name}
        >
          Blue
        </RemoteButton>
        <RemoteButton
          bsStyle="danger"
          topic={command_topic + commands.Red.action.deviceId}
          message={commands.Red.name}
        >
          Red
        </RemoteButton>
        <RemoteButton
          bsStyle="success"
          topic={command_topic + commands.Green.action.deviceId}
          message={commands.Green.name}
        >
          Green
        </RemoteButton>
      </ButtonGroup>
    </Row>
  );
};
