import React from "react";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import './styles.scss';
import { useVisualMode } from '../../hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment(props) {
  const hook = useVisualMode(props.interview ? SHOW : EMPTY);
  const save = (name, interviewer) => {
    let interviewerObj = props.interviewers.filter(i => i.id === interviewer)[0];
    const interview = {
      student: name,
      interviewer: interviewerObj
    };
    hook.transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(res => hook.transition(SHOW));
  }
  const cancel = () => {
    props.cancelInterview(props.id);
    hook.transition(EMPTY);
  };
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />} */}
      { hook.mode === EMPTY && <Empty onAdd={() => hook.transition(CREATE)}/> }
      { hook.mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      { hook.mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={cancel} /> }
      { hook.mode === SAVING && <Status message={'Saving...'}/>}
    </article>
  )
}