import { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import ReactSpeedometer, { Transition } from "react-d3-speedometer";
import * as loader from "./car_loader.json";
import axios from "axios";

const max = (a, b) => (a >= b ? a : b);
const min = (a, b) => (a <= b ? a : b);

const Home = () => {
  const [speed, setSpeed] = useState(0);
  const [angle, setAngle] = useState(0);
  const [speedLock, setSpeedLock] = useState(false);

  const changeSpeed = (factor) => {
    setSpeed(max(0, min(180, speed + factor)));
  };

  const changeAngle = (factor) => {
    setAngle(max(-90, min(90, angle + factor)));
  };

  useEffect(() => {
    setInterval(() => {
      axios.post("http://localhost:4444/sendstats", {
        speed: speed,
        angle: angle,
        time: new Date().getTime(),
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const keyDownEvent = (event) => {
      let keycode = event.code;
      switch (keycode) {
        case "KeyW":
        case "Space":
          setSpeedLock(true);
      }
    };

    const keyUpEvent = (event) => {
      let keycode = event.code;
      switch (keycode) {
        case "KeyW":
        case "Space":
          setSpeedLock(false);
      }
    };

    const keyPressedEvent = (event) => {
      let keycode = event.code;
      switch (keycode) {
        case "KeyW":
          changeSpeed(3);
          break;
        case "Space":
          changeSpeed(-3);
          break;
        case "KeyI":
          changeAngle(-1);
          break;
        case "KeyO":
          changeAngle(1);
          break;
        case "KeyU":
          changeAngle(-4);
          break;
        case "KeyP":
          changeAngle(4);
          break;
      }
    };

    setTimeout(() => {
      if (!speedLock) {
        if (speed > 0) changeSpeed(-1);
        else if (speed < 0) changeSpeed(1);
      }
    }, 50);

    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("keypress", keyPressedEvent);
    window.addEventListener("keyup", keyUpEvent);
    return () => {
      window.removeEventListener("keydown", keyDownEvent);
      window.removeEventListener("keypress", keyPressedEvent);
      window.removeEventListener("keyup", keyUpEvent);
    };
  });

  return (
    <div
      style={{
        background: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "50px",
        boxSizing: "border-box",
        fontFamily: "'Comfortaa', cursive",
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: "40px",
          padding: "30px",
          boxSizing: "border-box",
          fontWeight: "bold",
        }}
      >
        Driving Simulator
      </div>
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ReactSpeedometer
            minValue={0}
            maxValue={180}
            value={speed}
            segments={10}
            needleTransition={Transition.easeElastic}
            needleTransitionDuration={5}
            width={500}
            textColor={"#d8dee9"}
            startColor={"rgb(0,250,55)"}
            endColor={"red"}
          />
          <div style={{ fontWeight: "bold" }}>Speed</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ReactSpeedometer
            minValue={-90}
            maxValue={90}
            value={angle}
            needleHeightRatio={0.7}
            customSegmentStops={[-90, 0, 90]}
            segmentColors={["#9399ff", "#14ffec"]}
            customSegmentLabels={[
              {
                text: "Left",
                position: "OUTSIDE",
                color: "#d8dee9",
              },
              {
                text: "Right",
                position: "OUTSIDE",
                color: "#d8dee9",
              },
            ]}
            needleTransition={Transition.easeLinear}
            needleTransitionDuration={5}
            ringWidth={47}
            needleColor={"#a7ff83"}
            textColor={"#d8dee9"}
            width={500}
          />
          <div style={{ fontWeight: "bold" }}>Steering Wheel</div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [load, setLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 2000);
  }, []);

  return !load ? (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FadeIn>
        <div>
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      </FadeIn>
      <div style={{ textAlign: "center", position: "fixed", bottom: "20px" }}>
        Loading ...
      </div>
    </div>
  ) : (
    <FadeIn>
      <Home />
    </FadeIn>
  );
};

export default App;
