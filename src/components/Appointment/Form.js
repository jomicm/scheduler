import React, { useState, useEffect } from 'react';
import InterviewerList from '../InterviewerList';
import Button from '../Button';

export default function Form(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [name, setName] = useState(props.name || '');
  const [error, setError] = useState("");
  const reset = () => {
    setName('');
    setInterviewer(null);
  };
  const cancel = () => {
    reset();
    props.onCancel();
  };
  const validate = () => {
    if (name === "" || !interviewer) {
      setError("Student name cannot be blank");
      return;
    }
    props.onSave(name, interviewer);
  }
  useEffect(() => {setError('')}, [name, interviewer]);
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            data-testid="student-name-input"
            className="appointment__create-input text--semi-bold"
            name={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={e => setName(e.target.value)}
            value={name}
          /*
            This must be a controlled component
          */
          />
          <label className="appointment__validation" style={{color:'red'}}>{error}</label>
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} selected={interviewer}/>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={() => cancel()} danger>Cancel</Button>
          <Button onClick={() => validate()} confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}