import React, { useReducer } from "react";

import {
  ButtonGroup,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import Thermostat from "react-nest-thermostat";
import { FaChevronUp, FaChevronDown, FaChevronRight } from "react-icons/fa";

import useConfig from "@/hooks/useConfig";
import useWeather from "@/hooks/useWeather";
import useThermostat from "@/hooks/useThermostat";
import thermostatReducer from "@/hooks/reducers/thermostatReducer";
import Locale from "@/lib/Locale";

const ThermostatTab = ({ thermostat }) => {
  const device = thermostat.device;
  const Config = useConfig(),
    metric = Config.metric;
  const thermoState = useThermostat(device);
  const [, dispatch] = useReducer(thermostatReducer, { device: device });
  const weather = useWeather(thermoState ? thermoState.postal_code : null),
    { now } = weather;

  if (!thermoState) {
    return null;
  }
  const hvacModeChange = mode => {
    try {
      dispatch({ type: "hvac_mode", value: mode });
    } catch (e) {}
  };

  const setTargetTemperature = temp => {
    try {
      dispatch({ type: "target_temp", value: temp });
    } catch (e) {}
  };

  const adjustTemperature = temp => {
    const newVal = Number(thermoState.target_temperature_f) + temp;
    try {
      dispatch({ type: "target_temp", value: newVal });
    } catch (e) {}
  };

  const adjustTemperatureButton = delta => {
    const d = metric ? parseInt((10 * delta) / 1.8) / 10 : delta;
    return (
      <Button
        onClick={() => {
          adjustTemperature(d);
        }}
      >
        {delta < 0 ? <FaChevronDown /> : <FaChevronUp />}
        {d}
      </Button>
    );
  };

  const render = () => {
    const thermostat = thermoState;

    if (!thermostat || !thermostat.away) {
      return null;
    }

    const target = n => {
      let icon = <FaChevronRight />,
        disabled = false;

      if (thermostat.target_temperature_f > n) {
        icon = <FaChevronDown />;
      } else if (thermostat.target_temperature_f < n) {
        icon = <FaChevronUp />;
      } else {
        icon = <FaChevronRight />;
        disabled = true;
      }
      return (
        <Button block disabled={disabled} onClick={() => setTargetTemperature(n)}>
          {icon} Set to {Locale.format("temperature", n, metric, true)}
        </Button>
      );
    };

    const renderTargets = () => {
      switch (thermoState.hvac_mode) {
        case "Off":
        default:
          return null;
        case "heat":
          return (
            <ButtonGroup vertical style={{ width: "100%" }}>
              {target(78)}
              {target(77)}
              {target(76)}
              {target(75)}
              {target(74)}
              {target(73)}
              {target(72)}
              {target(71)}
              {target(70)}
              {target(69)}
            </ButtonGroup>
          );
        case "cool":
          return (
            <ButtonGroup vertical style={{ width: "100%" }}>
              {target(82)}
              {target(81)}
              {target(80)}
              {target(79)}
              {target(78)}
              {target(77)}
              {target(76)}
              {target(75)}
              {target(74)}
              {target(73)}
            </ButtonGroup>
          );
      }
    };

    // RENDER
    if (!thermostat.ambient_temperature_f || !thermostat.target_temperature_f) {
      return null;
    }
    return (
      <Row style={{ marginTop: 6 }}>
        <Col sm={3}>
          <ListGroup>
            <ListGroupItem>
              Presence
              <span style={{ float: "right" }}>{thermostat.away.toUpperCase()}</span>
            </ListGroupItem>
            <ListGroupItem>
              Ambient Temperature
              <span style={{ float: "right" }}>
                {Locale.format("temperature", thermostat.ambient_temperature_f, metric, true)}
              </span>
            </ListGroupItem>
            <ListGroupItem>
              Ambient Humidity
              <span style={{ float: "right" }}>{thermostat.humidity}%</span>
            </ListGroupItem>
            <ListGroupItem>
              Mode
              <span style={{ float: "right" }}>{thermostat.hvac_mode}</span>
            </ListGroupItem>
            <ListGroupItem>
              Operating State
              <span style={{ float: "right" }}>{thermostat.hvac_state}</span>
            </ListGroupItem>
          </ListGroup>
          <ListGroup>
            <ListGroupItem>
              {thermostat.structure_name}
              <span style={{ float: "right" }}>{thermostat.postal_code}</span>
            </ListGroupItem>
            <ListGroupItem>
              Outside Temperature
              <span style={{ float: "right" }}>
                {Locale.format("temperature", now.temperature, metric, true)}
              </span>
            </ListGroupItem>
            <ListGroupItem>
              Outside Humidity
              <span style={{ float: "right" }}>{now.humidity}%</span>
            </ListGroupItem>
            <ListGroupItem>
              Conditions
              <span style={{ float: "right" }}>{now.description}</span>
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col sm={6}>
          <div style={{ textAlign: "center" }}>
            <Thermostat
              style={{ textAlign: "center " }}
              width="400px"
              height="400px"
              away={Boolean(thermostat.away !== "home")}
              ambientTemperature={Locale.ftoc(thermostat.ambient_temperature_f, metric)}
              targetTemperature={Locale.ftoc(thermostat.target_temperature_f, metric)}
              hvacMode={thermostat.hvac_state}
              leaf={thermostat.has_leaf}
            />
            <ButtonGroup style={{ marginBottom: 8 }}>
              {adjustTemperatureButton(-3)}
              {adjustTemperatureButton(-2)}
              {adjustTemperatureButton(-1)}
              {adjustTemperatureButton(1)}
              {adjustTemperatureButton(2)}
              {adjustTemperatureButton(3)}
            </ButtonGroup>
            <ToggleButtonGroup
              onChange={hvacModeChange}
              type="radio"
              size="lg"
              name="hvac"
              value={thermostat.hvac_mode}
            >
              <ToggleButton style={{ width: 85, fontSize: 14 }} value="off">
                Off
              </ToggleButton>
              <ToggleButton style={{ width: 85, fontSize: 14 }} value="heat">
                Heat
              </ToggleButton>
              <ToggleButton style={{ width: 85, fontSize: 14 }} value="cool">
                Cool
              </ToggleButton>
              <ToggleButton style={{ width: 110, fontSize: 14 }} value="heat-cool">
                Heat/Cool
              </ToggleButton>
              <ToggleButton style={{ width: 85, fontSize: 14 }} value="Eco">
                Eco
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Col>
        <Col sm={3}>
          <ListGroup>
            <ListGroupItem>
              Target Temperature
              <span style={{ float: "right" }}>
                {Locale.format("temperature", thermostat.target_temperature_f, metric, true)}
              </span>
            </ListGroupItem>
            <ListGroupItem>
              Time To Target
              <span style={{ float: "right" }}>{thermostat.time_to_target}</span>
            </ListGroupItem>
          </ListGroup>
          {renderTargets()}
        </Col>
      </Row>
    );
  };

  return render();
};

export default ThermostatTab;
