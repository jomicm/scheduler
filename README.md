# 🗓 Interview Scheduler

Scheduler is an application intended to book interviews with available mentors. It has a modern looking design and was built using React library. 
You can select days and look for available spaces so you can create a new appointment or edit existing ones.

This project was built as a part of the Lighthouse Labs Web Development Bootcamp for the purposes of practice React and extensive testing. (Static, Unit, Integration, End-to-end)

- <a href="http://159.203.41.87:8000/" target="_blank">Try it! Hosted in Digital Ocean using Docker technology</a>

- <a href="https://youthful-jones-cbf1ec.netlify.com/" target="_blank">Try it! Hosted in Heroku and Netlify</a>

## Application screens

#### Welcome to Scheduler!
![Welcome](/docs/welcome.png)

#### You can book an appointment!
![Appointment](/docs/appointment.png)

#### This is how you book an appointment!
![Create](/docs/create-appointment.gif)

#### This is how you edit an appointment!
![Create](/docs/edit-appointment.gif)

#### This is how you delete an appointment!
![Create](/docs/delete-appointment.gif)

#### Real-time updates!
![Create](/docs/websockets.gif)


## Getting Started

1. Fork/Clone this repository.
2. Install dependencies using the `npm install` command.
3. Start the Webpack Development Server using the `npm start` command. The app will be served at <http://localhost:8000/>.
4. Go to <http://localhost:8000/> in your browser.
5. You should have running also `scheduler-api` at <http://localhost:8001/>
6. You have to have a local Postgres database named scheduler_development.

## Functionality

- You can add new appointments by clickig add button at any available spot.
- Once you save your appointment, you can either edit or delete it.
- When you edit you can update your name and the interviewer.
- When you delete an appointment you will be asked for confirmation.

## Additional functionality

- You can have several browser clients open, the site uses websockets to keep all of them updated.
- Hosted in digital ocean using docker technology. 
- Hosted in Heroku and Netlify using CircleCI to manage continuos integration.

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Dependencies

- @testing-library/react-hooks
- axios
- classnames
- dotenv
- normalize.css
- prop-types
- react
- react-dom
- react-scripts
- ws

## Future Development

- Publish to online server using Docker technology (done)

## Authors

* **Miguel Cruz** [@jomicm](https://github.com/jomicm) - *Initial work* - 
