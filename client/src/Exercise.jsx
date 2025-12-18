import { useState, useEffect } from "react";
import "./App.css";
import exercises from "./exercises.json";
import axios from "axios";
import { MDBCard, MDBCardTitle, MDBCardText } from "mdb-react-ui-kit";

export default function Exercise() {
  console.log(exercises?.map((exercise) => exercise.bodyPart));
  const [image, setImage] = useState("");
  const [isImageVisible, setIsImageVisible] = useState(true);

  async function getImage() {
    const response = await axios({
      method: "GET",
      url: "https://exercisedb.p.rapidapi.com/image",
      params: {
        resolution: "720",
        exerciseId: filteredExercises[currentExerciseIndex].id,
      },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_API_KEY,
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      },
      responseType: "arraybuffer",
    });
    try {
      const buffer = new Uint8Array(response.data);
      let binary = "";
      for (let i = 0; i < buffer.byteLength; i++) {
        binary += String.fromCharCode(buffer[i]);
      }
      const base64String = btoa(binary);
      setImage(base64String);
      setIsImageVisible(true);
    } catch (error) {
      console.log(error.code);
    }
    setIsImageVisible(false);
  }

  const [target, setTarget] = useState("abs");

  function onTargetChange(e) {
    setTarget(e.target.value);
  }

  const [steps, setSteps] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  function nextStep(exerciseId, instructionLength) {
    if (instructionLength > 0) {
      setSteps((prevSteps) => {
        const currentStep = prevSteps[exerciseId];
        let newStep;
        if (currentStep === undefined) {
          newStep = 0;
        } else {
          newStep = (currentStep + 1) % instructionLength;
        }
        return {
          ...prevSteps,
          [exerciseId]: newStep,
        };
      });
    }
  }
  const filteredExercises = exercises.filter(
    (exercise) => exercise?.target === target
  );

  function nextExercise() {
    const totalExercises = filteredExercises.length;
    if (totalExercises > 0) {
      setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % totalExercises);
    }
  }

  function previousExercise() {
    const totalExercises = filteredExercises.length;
    if (totalExercises > 0) {
      setCurrentExerciseIndex((prevIndex) => (prevIndex - 1) % totalExercises);
    }
  }

  const exerciseToDisplay = filteredExercises?.[currentExerciseIndex];

  const instructionLength = exerciseToDisplay.instructions?.length || 0;
  const currentStep = steps[exerciseToDisplay?.id];
  const currentInstruction = exerciseToDisplay?.instructions?.[currentStep];
  const isBeginState = currentStep === undefined;

  const showCard = exerciseToDisplay && exerciseToDisplay?.id;

  useEffect(() => {
    if (image === undefined) {
      return;
    } else {
      getImage();
    }
  }, [exerciseToDisplay?.id]);

  return (
    <div>
      <select value={target} name="target" onChange={onTargetChange} id="">
        {exercises.map((target) =>
          target?.bodyParts?.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))
        )}
      </select>
      {showCard && (
        <MDBCard
          style={{ width: "90%", margin: "48px auto" }}
          key={exerciseToDisplay.id}
        >
          <MDBCardTitle
            style={{ padding: 8, textTransform: "capitalize" }}
            htmlFor=""
          >
            {exerciseToDisplay.name}
          </MDBCardTitle>
          <img
            width=""
            src={`data:image/gif;base64,${image}`}
            style={
              isImageVisible
                ? { display: "none" }
                : { width: "100%", height: "100%" }
            }
            alt=""
          />
          {isImageVisible && (
            <p style={{ textAlign: "center" }}>Loading Image...</p>
          )}
          <MDBCardText
            style={isBeginState ? { display: "none" } : { padding: 8 }}
          >
            {currentInstruction}
          </MDBCardText>
          <p style={{ margin: 0, padding: 0, textAlign: "center" }}>
            <strong>
              {isBeginState
                ? ""
                : `Step ${currentStep + 1} of ${instructionLength}`}
            </strong>
          </p>
          {instructionLength > 0 && (
            <button
              style={{
                margin: "16px",
                padding: 8,
                border: "none",
                fontWeight: 900,
                marginBottom: 0,
              }}
              onClick={() => nextStep(exerciseToDisplay.id, instructionLength)}
            >
              {isBeginState || currentStep === currentStep.length
                ? "Begin Instructions"
                : `Next Step (${
                    ((currentStep + 1) % instructionLength) + 1
                  } of ${instructionLength})`}
            </button>
          )}
          <div className="buttons">
            <button
              style={{
                margin: "16px",
                padding: 8,
                border: "none",
                fontWeight: 900,
                marginTop: 8,
                width: "100%",
              }}
              onClick={previousExercise}
              disabled={
                filteredExercises.length === 0 || currentExerciseIndex === 0
              }
            >
              Previous
            </button>
            <button
              style={{
                margin: "16px",
                padding: 8,
                border: "none",
                fontWeight: 900,
                marginTop: 8,
                width: "100%",
              }}
              onClick={nextExercise}
            >
              Next Exercise
            </button>
          </div>
        </MDBCard>
      )}
    </div>
  );
}
