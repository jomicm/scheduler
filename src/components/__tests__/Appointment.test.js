/*
  We are rendering `<Application />` down below, so we need React.createElement
*/
import React from "react";
import {render, prettyDom, getByText, fireEvent, waitForElement } from '@testing-library/react'


/*
We import our helper functions from the react-testing-library
The render function allows us to render Components
*/
// import { render } from "@testing-library/react";

/*
We import the component that we are testing
*/
import Application from "components/Application";
import Appointment from "components/Appointment";

// it('2 children', () => {
//   const {container} = render(<Application />);
//   expect(container.firstChild.children.length).toBe(1);
// })

// it('text', () => {
//   const {container, getByText} = render(<Application />);
//   expect(getByText('buy apples'));
// })
// it('check when clicked', () => {
//   const done = false;
//   const {container, getByText} = render(<Application/>);
//   fireEvent.click(container.firstChild.children[0]);
//   console.log(prettyDom(container.firstChild.children[0]));

// })
/*
  A test that renders a React Component
*/
describe("Appointment", () => {
  it("renders Application without crashing", () => {
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
          interview={{interviewer: {name:'name'}}}
          interviewers={[]}
        />
    )
  });
});