import React from "react";
import { useState, useEffect } from "react";
import exercises from "./exercises.json";
import axios from "axios";

const ExerciseContext = React.createContext();

function ExerciseContextProvider({ children }) {
  const [image, setImage] = useState("");

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
      console.log(response.data);
    } catch (error) {
      console.log(error.code);
    }
  }
  console.log(image);
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
    // if (!exerciseToDisplay?.id) return;
    if (image === undefined) {
      return;
    } else {
      getImage();
    }
  }, [exerciseToDisplay?.id]);

  //   console.log(image);
  //   console.log(steps);
  //   console.log(filteredExercises[currentExerciseIndex].id);
  return (
    <ExerciseContext.Provider
      value={{
        image,
        target,
        // getImage,
        onTargetChange,
        steps,
        currentExerciseIndex,
        nextStep,
        exercises,
        nextExercise,
        previousExercise,
        filteredExercises,
        exerciseToDisplay,
        instructionLength,
        currentStep,
        currentInstruction,
        isBeginState,
        showCard
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
}

export { ExerciseContext, ExerciseContextProvider };
