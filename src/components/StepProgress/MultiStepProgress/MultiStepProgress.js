import React from "react";
import "./MultiStepProgress.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgress = ({ page, onPageNumberClick }) => {
  var stepPercentage = 0;
  if (page === "pageone") {
    stepPercentage = 14;
  } else if (page === "pagetwo") {
    stepPercentage = 38;
  } else if (page === "pagethree") {
    stepPercentage = 62.5;
  } else if (page === "pagefour") {
    stepPercentage = 89;
  } else if (page === "pagefive") {
      stepPercentage = 100;
  } else {
    stepPercentage = 0;
  }

  return (
    <ProgressBar percent={stepPercentage}>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("pageone")}
          >
            {index + 1}
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("pagetwo")}
          >
            {index + 1}
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("pagethree")}
          >
            {index + 1}
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("pagefour")}
          >
            {index + 1}
          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null}`}
            onClick={() => onPageNumberClick("pagefive")}
          >
            {index + 1}
          </div>
        )}
      </Step>
    </ProgressBar>
  );
};

export default MultiStepProgress;
