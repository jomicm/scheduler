import React, { useEffect } from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import "./styles.scss";
import { useVisualMode } from "../../hooks/useVisualMode";
import transition from "../../helpers/transitions";

// Appointment Component
export default function Appointment(props) {
  const hook = useVisualMode(
    props.interview ? transition.SHOW : transition.EMPTY
  );

  useEffect(() => {
    if (props.interview) hook.transition(transition.SHOW);
    else if (!props.interview) hook.transition(transition.EMPTY);
  }, [props.interview]);

  const save = (name, interviewer, edit = false) => {
    hook.cleanError();
    if (!name.length || !interviewer) {
      hook.putError("student name cannot be blank");
      return;
    }
    let interviewerObj = props.interviewers.filter(
      i => i.id === interviewer
    )[0];
    const interview = {
      student: name,
      interviewer: interviewerObj
    };
    hook.transition(transition.SAVING);
    props
      .bookInterview(props.id, interview, edit)
      .then(res => hook.transition(transition.SHOW))
      .catch(err => hook.transition(transition.ERROR_SAVE));
  };

  const deleteInterview = () => {
    hook.transition(transition.DELETING);
    props
      .deleteInterview(props.id)
      .then(res => hook.transition(transition.EMPTY))
      .catch(err => hook.transition(transition.ERROR_DELETE, true));
  };

  const confirmDeleteInterview = () => {
    hook.transition(transition.CONFIRM);
  };

  const editInterview = () => {
    hook.transition(transition.EDIT);
  };

  return (
    <article data-testid="appointment" className="appointment">
      <Header time={props.time} />
      {hook.mode === transition.EMPTY && (
        <Empty onAdd={() => hook.transition(transition.CREATE)} />
      )}
      {hook.mode === transition.SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDeleteInterview}
          onEdit={editInterview}
        />
      )}
      {hook.mode === transition.EDIT && (
        <Form
          error={hook.error}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          edit={true}
          onSave={save}
          onCancel={() => {
            hook.transition(transition.SHOW);
            hook.cleanError();
          }}
        />
      )}
      {hook.mode === transition.CREATE && (
        <Form
          error={hook.error}
          interviewers={props.interviewers}
          edit={false}
          onSave={save}
          onCancel={() => {
            hook.transition(transition.EMPTY);
            hook.cleanError();
          }}
        />
      )}
      {hook.mode === transition.SAVING && <Status message={"Saving..."} />}
      {hook.mode === transition.CONFIRM && (
        <Confirm
          message={"Are you sure to delete appointment?"}
          onConfirm={deleteInterview}
          onCancel={() => hook.transition(transition.SHOW)}
        />
      )}
      {hook.mode === transition.DELETING && <Status message={"Deleting..."} />}
      {hook.mode === transition.ERROR_SAVE && (
        <Error
          message={"Error while saving/updating"}
          onClose={() => hook.back()}
        />
      )}
      {hook.mode === transition.ERROR_DELETE && (
        <Error message={"Error while deleting"} onClose={() => hook.back()} />
      )}
    </article>
  );
}
