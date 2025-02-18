import "smart-webcomponents-react/source/styles/smart.default.css";
import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  RepeatButton,
  ToggleButton,
  PowerButton,
} from "smart-webcomponents-react/button";
import { Calendar } from "smart-webcomponents-react/calendar";
import { Input } from "smart-webcomponents-react/input";
import { Scheduler } from "smart-webcomponents-react/scheduler";
import { generateEvents, getGanttDataSource } from "./utils";
import { people } from "./constants";
import Legend from "./Legend/Legend";
import EventCount from "./EventCount/EventCount";
import { GanttChart } from "smart-webcomponents-react/ganttchart";
import { DropDownList, ListItem } from "smart-webcomponents-react/dropdownlist";

const GanttComponent = ({data}) => {

  const ganttRef = useRef(null);
  useEffect(() => {
    if (ganttRef.current) {
      ganttRef.current.groupByResources = true; // Enable grouping
    }
  }, []);

  const taskColumns = [
    {
        label: "Resource",
        value: "resources",
        formatFunction: function (value, item) {
          if (!item || !item.resources || item.resources.length === 0) {
            return '<span class="unassigned">Unassigned</span>';
          }
          const getResource = (id) => people.find((res) => res.id === id);
          return item.resources
            .map((id) => {const res = getResource(id)?.label || "Unknown"; return res;})
            [0];
        }
    },
  ];

  return (
            <GanttChart
              ref={ganttRef}
              dataSource={data}
              taskColumns={taskColumns}
              id="gantt"
              style={{width: '100%'}}
              view={"day"}
              durationUnit="day"
              groupByResources={true}
            ></GanttChart>
  );
};

export default GanttComponent;
