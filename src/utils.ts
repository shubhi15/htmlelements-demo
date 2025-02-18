import { people } from "./constants";

export const generateEvents = (eventCount: number) => {
    const events = [];
    const startDate = new Date(2025, 2, 1);
    const endDate = new Date(2025, 7, 28);
    

    for (let i = 0; i < eventCount; i++) {
        const personIndex = i % people.length;
        const person = people[personIndex];

        const randomDay = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

        const hour = Math.floor(Math.random() * 10) + 8;
        const duration = Math.floor(Math.random() * 2) + 1;

        const start = new Date(randomDay);
        start.setHours(hour, 0, 0);

        const end = new Date(start);
        end.setHours(start.getHours() + duration);

        const eventType = Math.random() > 0.5 ? "service" : "non-service";

        events.push({
            id: i + 1,
            dateStart: start,
            dateEnd: end,
            label: `Event ${i + 1}`,
            backgroundColor: person.color, // Assign background color from person
            resourceId: person.id, // Assign person id as resource
            type: eventType,
            customAttr: 'New Attr'
        });
    }
    return events;
};

export const getGanttDataSource = () => {
return [{
    label: 'PRD & User-Stories',
    dateStart: '2023-01-10',
    dateEnd: '2023-03-10',
    class: 'product-team',
    type: 'task'
},
{
    label: 'Persona & Journey',
    dateStart: '2023-03-01',
    dateEnd: '2023-04-30',
    class: 'marketing-team',
    type: 'task'
},
{
    label: 'Architecture',
    dateStart: '2023-04-11',
    dateEnd: '2023-05-16',
    class: 'product-team',
    type: 'task'
},
{
    label: 'Prototyping',
    dateStart: '2023-05-17',
    dateEnd: '2023-07-01',
    class: 'dev-team',
    type: 'task'
},
{
    label: 'Design',
    dateStart: '2023-07-02',
    dateEnd: '2023-08-01',
    class: 'design-team',
    type: 'task'
},
{
    label: 'Development',
    dateStart: '2023-08-01',
    dateEnd: '2023-09-10',
    class: 'dev-team',
    type: 'task'
},
{
    label: 'Testing & QA',
    dateStart: '2023-09-11',
    dateEnd: '2023-10-10',
    class: 'qa-team',
    type: 'task'
},
{
    label: 'UAT Test',
    dateStart: '2023-10-12',
    dateEnd: '2023-11-11',
    class: 'product-team',
    type: 'task'
},
{
    label: 'Handover & Documentation',
    dateStart: '2023-10-17',
    dateEnd: '2023-11-31',
    class: 'marketing-team',
    type: 'task'
},
{
    label: 'Release',
    dateStart: '2023-11-01',
    dateEnd: '2023-12-31',
    class: 'release-team',
    type: 'task'
}
];
}




