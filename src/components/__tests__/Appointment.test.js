import React from "react";
import { render } from "@testing-library/react";
import Application from "components/Application";
import Appointment from "components/Appointment";

// Main Appointment Component tests
describe("Appointment", () => {
  xit("renders Application without crashing", () => {
    render(<Application />);
  });

  it("renders Appointment without crashing", () => {
    render(
      <Appointment
        bookInterview={() => {}}
        deleteInterview={() => {}}
        key={1}
        id={1}
        time={12}
        interview={{ interviewer: { name: "name" } }}
        interviewers={[]}
      />
    );
  });
});
