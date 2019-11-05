import React from "react";
import DayListItem from "./DayListItem";

// DayList Component
export default function DayList(props) {
  const days = props.days.map((day, ix) => (
    <DayListItem
      key={"daylistitem_" + ix}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      setDay={props.setDay}
    />
  ));
  return <ul>{days}</ul>;
}
