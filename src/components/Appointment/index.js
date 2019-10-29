import React from "react";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import './styles.scss';
import { useVisualMode } from '../../hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

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
      .then(res => hook.transition(res.status[0] === 2 ? SHOW : ERROR_SAVE))
      .catch(err => console.error('save', err));
  };
  const deleteInterview = () => {
    hook.transition(DELETING);
    props.deleteInterview(props.id)
      .then(res => hook.transition(res.status[0] === 2 ? EMPTY : ERROR_DELETE))
      .catch(err => console.error('selete', err));
  };
  const confirmDeleteInterview = () => {
    hook.transition(CONFIRM);
  };
  const editInterview = () => {
    console.log('EDIT this>', props.id)
    hook.transition(EDIT);
  };
  return (
    <article className="appointment">
      <Header time={props.time}/>
      { hook.mode === EMPTY && <Empty onAdd={() => hook.transition(CREATE)}/> }
      { hook.mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDeleteInterview}
          onEdit={editInterview}
        />
      )}
      { hook.mode === EDIT && <Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onSave={save} onCancel={() => hook.transition(SHOW)} /> }
      { hook.mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={() => hook.transition(EMPTY)} /> }
      { hook.mode === SAVING && <Status message={'Saving...'}/>}
      { hook.mode === CONFIRM && <Confirm message={'Are you sure to delete appointment?'} onConfirm={deleteInterview} onCancel={() => hook.transition(SHOW)}/>}
      { hook.mode === DELETING && <Status message={'Deleting...'}/>}
      { hook.mode === ERROR_SAVE && <Error message={'Error while saving/updating'} onClose={() => hook.back()}/>}
      { hook.mode === ERROR_DELETE && <Error message={'Error while deleting'} onClose={() => hook.transition(SHOW)}/>}
    </article>
  )
}