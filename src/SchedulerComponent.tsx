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
import { Tree, TreeItem, TreeItemsGroup } from "smart-webcomponents-react/tree";
import { Scheduler } from "smart-webcomponents-react/scheduler";
import { generateEvents } from "./utils";
import { people } from "./constants";
import Legend from "./Legend/Legend";
import EventCount from "./EventCount/EventCount";
import MoreEventIndicator from "./MoreEventIndicator/MoreEventIndicator";

const SchedulerComponent = () => {
  const [visiblePeople, setVisiblePeople] = useState<string[]>(
    people.map((p) => p.name)
  );
  const [renderTime, setRenderTime] = useState<string[]>(
    people.map((p) => p.name)
  );

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const measureRenderTime = (updateFunction, opType) => {
    const start = performance.now();

    updateFunction(); // Asynchronous state update

    // Wait for state update to reflect in the DOM
    requestAnimationFrame(() => {
      setTimeout(() => {
        const end = performance.now();
        console.log(`Updated ${opType} in: ${end - start} ms`);
      }, 0);
    });
  };
  const [eventCount, setEventCount] = useState(100);
  const scheduler = useRef(null);
  const calendar = useRef(null);
  const primaryContainer = useRef(null);
  const [view, setView] = useState("month");

  const today = new Date();

  const [nonworkingDays, setNonworkingDays] = useState(
    getPastThreeWeekdays(today.getDay())
  );
  const [data, setData] = useState(generateEvents(eventCount));

  const eventTemplate = function (eventContent, eventObj) {
    const scheduler = this;

    let eventContentWrapper = eventContent.querySelector(
      ".event-content-wrapper"
    );

    if (!eventContentWrapper) {
      eventContentWrapper = document.createElement("div");
      eventContentWrapper.classList.add("event-content-wrapper");
    }

    let label = eventContent.querySelector("label"),
      time = eventContent.querySelector(".time"),
      customDiv = eventContent.querySelector(".custom-attr");

    if (!label) {
      label = document.createElement("label");
      label.classList.add("event-label");
      eventContentWrapper.appendChild(label);
    }

    if (!time) {
      time = document.createElement("span");
      time.classList.add("time");
      eventContentWrapper.appendChild(time);
    }

    if (!customDiv) {
      customDiv = document.createElement("span");
      customDiv.classList.add("custom-attr");
      eventContentWrapper.appendChild(customDiv);
    }

    // Set text content with separator "|"
    label.textContent = eventObj.label;
    time.textContent = `${new Intl.DateTimeFormat(scheduler.locale, {
      hour: scheduler.hourFormat,
      minute: scheduler.minuteFormat,
    }).format(eventObj.dateStart)} to ${new Intl.DateTimeFormat(
      scheduler.locale,
      {
        hour: scheduler.hourFormat,
        minute: scheduler.minuteFormat,
      }
    ).format(eventObj.dateEnd)}`;

    customDiv.textContent = eventObj.customAttr
      ? `| ${eventObj.customAttr}`
      : "";

    // Combine into a single line
    eventContentWrapper.innerHTML = `${label.textContent} | ${time.textContent} ${customDiv.textContent}`;

    if (!eventContentWrapper.parentElement) {
      eventContent.appendChild(eventContentWrapper);
    }

    return eventContent;
  };

  const views = ["day", "week", "month", "agenda"];

  const firstDayOfWeek = 1;

  const disableDateMenu = true;

  const currentTimeIndicator = true;

  const scrollButtonsPosition = "far";

  function getPastThreeWeekdays(weekday) {
    let weekdays = [];

    for (let i = 0; i < 3; i++) {
      weekdays.push((weekday - i + 7) % 7);
    }

    return weekdays;
  }

  const updateData = (event) => {
    const item = event.detail.item;
    const newData = [...data];

    for (let i = 0; i < newData.length; i++) {
      const dataItem = newData[i];

      if (dataItem.label === item.label && dataItem.class === item.class) {
        event.type === "itemRemove"
          ? newData.splice(i, 1)
          : newData.splice(i, 1, item);
        setData(newData);
        return;
      }
    }
  };

  const addNew = () => {
    scheduler.current.openWindow({
      class: "event",
    });
  };

  const handleCalendarChange = (event) => {
    scheduler.current.dateCurrent = event.detail.value;
  };

  const handleDateChange = (event) => {
    calendar.current.selectedDates = [event.detail.value];
  };

  useEffect(() => {
    if (scheduler.current.props?.dataSource) {
      const events = generateEvents(eventCount);
      const datasrc = events.filter((event) =>
        visiblePeople.includes(event.personId)
      );
      measureRenderTime(() => setData(datasrc), "On filtering");
    }
  }, [visiblePeople]);

  useEffect(() => {
    const events = generateEvents(eventCount); // Generate 10,000 events
    measureRenderTime(() => setData(events), "On Event Count Update");
  }, [eventCount]);

  const togglePersonVisibility = (personId: string) => {
    setVisiblePeople((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleEventCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setEventCount(count);
  };
  const handleEventClick = (event) => {
    setSelectedEvent(event.detail);
    setDialogOpen(true);
  };

  const onViewChange = (event) => {
    setView(event?.detail?.value);
  };

  return (
    <div>
      <div id="scheduler-container" ref={primaryContainer}>
        <div id="header">
          <div id="title">Scheduler</div>
          <Button id="addNew" onClick={addNew}>
            <span>Create</span>
          </Button>
        </div>
        <div className="content">
          <section id="sideA">
            <div className="controls-container">
              <Calendar
                ref={calendar}
                id="calendar"
                scrollButtonsPosition={scrollButtonsPosition}
                onChange={handleCalendarChange}
              ></Calendar>

              <Legend
                visiblePeople={visiblePeople}
                togglePersonVisibility={togglePersonVisibility}
              />

              <EventCount
                eventCount={eventCount}
                handleEventCountChange={handleEventCountChange}
              />
            </div>
          </section>
          <section id="sideB">
            <Scheduler
              ref={scheduler}
              id="scheduler"
              dataSource={data}
              view={view}
              views={views}
              onViewChange={onViewChange}
              nonworkingDays={nonworkingDays}
              firstDayOfWeek={firstDayOfWeek}
              disableDateMenu={disableDateMenu}
              currentTimeIndicator={currentTimeIndicator}
              scrollButtonsPosition={scrollButtonsPosition}
              onDragEnd={updateData}
              onResizeEnd={updateData}
              onItemUpdate={updateData}
              onItemRemove={updateData}
              onDateChange={handleDateChange}
              maxEventsPerCell={2}
              eventTemplate={eventTemplate}
             
            
            ></Scheduler>
          </section>
        </div>
      </div>
      {isDialogOpen && (
        <div className="custom-modal">
          <h3>Edit Appointment</h3>
          <input type="text" defaultValue={selectedEvent?.label} />
          <input type="text" placeholder="Custom Location" />
          {/* <button onClick={handleSave}>Save</button> */}
          <button onClick={() => setDialogOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SchedulerComponent;
