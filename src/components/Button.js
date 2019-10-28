import React from "react";
import classNames from 'classnames';
import "components/Button.scss";

export default function Button(props) {
   let classnames = classNames('button', {'button--confirm': props.confirm}, {'button--danger': props.danger});
   return  <button disabled={props.disabled} className={classnames} onClick={props.onClick}>{props.children}</button>;
}
