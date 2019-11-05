import React from "react";
import classNames from 'classnames';
import "components/DayListItem.scss";

export default function DayListItem(props) {
  let dayClass = classNames('day-list__item', {'day-list__item--selected': props.selected}, {'day-list__item--full': !props.spots});
  const formatSpots = () => {
    let spotsMessage = props.spots !== 1 ? 'spots remaining' : 'spot remaining';
    return props.spots === 0 ? 'no ' + spotsMessage : props.spots + ' ' + spotsMessage;
  }
  return (
    <li data-testid="day" className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}