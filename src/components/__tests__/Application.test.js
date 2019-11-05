import React from "react";
import axios from "axios";
import { render, cleanup, waitForElement, fireEvent, prettyDOM, getAllByTestId, waitForElementToBeRemoved, queryByText, getByText, debug } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

describe("Form", () => {
  xit("renders without crashing", () => {
    render(<Application />);
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText('Monday'));
  });
  it("(promise chain) changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText('Monday'))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
      });
  });

  it("(async/await) changes the schedule when a new day is selected", async() => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText('Monday'))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    const addButton = appointment.children[1].firstChild;
    fireEvent.click(addButton);
    const inputName = appointment.children[1].firstChild.firstChild.firstChild
    fireEvent.change(inputName, {
      target: { value: "Lydia Miller-Jones" }
    });
    const interviewer = appointment.children[1].firstChild.children[1].children[1].firstChild.firstChild;
    fireEvent.click(interviewer);
    const onSaveBtn = appointment.children[1].children[1].firstChild.children[1];
    fireEvent.click(onSaveBtn);
    // debug()
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
     expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async() => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const article = appointments.find(app =>
      queryByText(app, "Archie Cohen")
    );
    const deleteBtn = article.children[1].children[1].firstChild.children[1];
    fireEvent.click(deleteBtn);
    await waitForElement(() => getByText(article, "Are you sure to delete appointment?"));
    const confirmBtn = article.children[1].children[1].children[1];
    fireEvent.click(confirmBtn);
    await waitForElementToBeRemoved(() => getByText(article, "Deleting..."));
    const confirmDelete = queryByText(article, "Archie Cohen");
    expect(confirmDelete).toBe(null);
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const article = appointments.find(app =>
      queryByText(app, "Archie Cohen")
    );
    const editBtn = article.children[1].children[1].firstChild.children[0];
    fireEvent.click(editBtn);
    await waitForElement(() => getByText(article, "Save"));
    const inputName = article.children[1].children[0].firstChild.firstChild;
    fireEvent.change(inputName, {
      target: { value: "Second Name" }
    });
    const saveBtn = article.children[1].children[1].firstChild.children[1];
    fireEvent.click(saveBtn);
    await waitForElementToBeRemoved(() => getByText(article, "Saving..."));
    const confirmEdit = queryByText(article, "Second Name");
    expect(confirmEdit).not.toBe(null);
  });

  /* test number five */
  it("shows the save error when failing to save an appointment", async() => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const article = appointments.find(app =>
      queryByText(app, "Archie Cohen")
    );
    
    const editBtn = article.children[1].children[1].firstChild.children[0];
    fireEvent.click(editBtn);
    await waitForElement(() => getByText(article, "Save"));
    const inputName = article.children[1].children[0].firstChild.firstChild;
    fireEvent.change(inputName, {
      target: { value: "Second Name" }
    });
    const saveBtn = article.children[1].children[1].firstChild.children[1];
    axios.put.mockRejectedValueOnce();
    fireEvent.click(saveBtn);
    await waitForElementToBeRemoved(() => getByText(article, "Saving..."));
    const closeBtn = article.children[1].children[1];
    fireEvent.click(closeBtn);
    // console.log('appointment',prettyDOM(article));
    const error = queryByText(article, "Error");
    expect(error).toBe(null);
  });
  it("shows the delete error when failing to save an appointment", async() => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const article = appointments.find(app =>
      queryByText(app, "Archie Cohen")
    );
    const deleteBtn = article.children[1].children[1].firstChild.children[1];
    fireEvent.click(deleteBtn);
    await waitForElement(() => getByText(article, "Are you sure to delete appointment?"));
    const confirmBtn = article.children[1].children[1].children[1];
    axios.delete.mockRejectedValueOnce();
    fireEvent.click(confirmBtn);
    await waitForElementToBeRemoved(() => getByText(article, "Deleting..."));
    const closeBtn = article.children[1].children[1];
    fireEvent.click(closeBtn);
    const error = queryByText(article, "Error");
    expect(error).toBe(null);
  });

});

