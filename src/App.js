import React, { Component } from 'react';
import Calendar from 'react-calendar';

const months = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];
const BLUE = "blue";
const RED = "red";
const weekDays = [1,2,3,4,5,6,7];
const frequency = [
  "Cada Setmana",
  "Cada 2 Setmanes",
  "Cada 4 Setmanes",
];

const dayMiliseconds = 86400000;
const today = new Date();
const endTime = new Date(2018, 8, 1);

const initialState = [{
  mes: 'Gener',
  diesHabils: [3,10,31],
  diesFestius: [17],
},
{
  mes: 'Febrer',
  diesHabils: [7,21],
  diesFestius: [14],
},
{
  mes: 'Març',
  diesHabils: [7,21,28],
  diesFestius: [14],
}];

class App extends Component {
  state = {
    calendarData: initialState,
    color: BLUE,
    enabledDay: today.getDay(),
    diesHabils: [],
    diesFestius: [],
  }

  componentWillMount() {
    const calendar = []
    for (let i = today.getMonth(); i !== endTime.getMonth(); i++) {
      if (!calendar.includes(i)) {
        calendar.push(i);
      }
      if (i === 11) {
        i = -1;
      }
    }
    const diesHabils = [];
    for (let i = today.getTime(); i <= endTime; i = i + dayMiliseconds*7) {
      diesHabils.push((new Date(i)).toDateString());
    }
    this.setState({ calendar, diesHabils });
  }

  onChangeFrequency = e => {
    const { value } = e.nativeEvent.target;
    const diesHabils = [];
    switch (value) {
      case "Cada Setmana": {
        for (let i = today.getTime(); i <= endTime; i = i + dayMiliseconds*7) {
          diesHabils.push((new Date(i)).toDateString());
        }
        break;
      }
      case "Cada 2 Setmanes": {
        for (let i = today.getTime(); i <= endTime; i = i + dayMiliseconds*14) {
          diesHabils.push((new Date(i)).toDateString());
        }
        break;
      }
      case "Cada 4 Setmanes": {
        for (let i = today.getTime(); i <= endTime; i = i + dayMiliseconds*28) {
          diesHabils.push((new Date(i)).toDateString());
        }
        break;
      }
      default:
        break;
    }
    this.setState({ diesHabils });
  }

  onPressTile = value => {
    const data = new Date(value);
    const { diesHabils, diesFestius, color } = this.state;
    switch (color) {
      case BLUE: {
        if (diesHabils.includes(data.toDateString())) {
          diesHabils.splice(diesHabils.indexOf(data.toDateString()),1);
        } else {
          diesHabils.push(data.toDateString());
          diesHabils.sort((a, b) => a - b);
          if (diesFestius.includes(data.toDateString())) {
            diesFestius.splice(diesFestius.indexOf(data.toDateString()),1);
          }
        }
        break;
      }
      case RED: {
        if (diesFestius.includes(data.toDateString())) {
          diesFestius.splice(diesFestius.indexOf(data.toDateString()),1);
        } else {
          diesFestius.push(data.toDateString());
          diesFestius.sort((a, b) => a - b);
          if (diesHabils.includes(data.toDateString())) {
            diesHabils.splice(diesHabils.indexOf(data.toDateString()),1);
          }
        }
        break;
      }
      default:
        break;
    }
    this.setState({ diesHabils, diesFestius });
  }

  renderTileClassName(date, view, month) {
    const { diesHabils, diesFestius } = this.state;
    if (date.getMonth() === month && diesFestius.includes(`${date.toDateString()}`)) {
      return 'calendar-tile-holiday';
    } else if (date.getMonth() === month && diesHabils.includes(`${date.toDateString()}`)) {
      return 'calendar-tile-active';
    }
    return null;
  }

  render() {
    const { calendar, enabledDay } = this.state;
    console.log(this.state);
    return (
      <div>
        <header>
          <h1>react-calendar sample page</h1>
        </header>
        <div className="calendar-controlpanel">
          <div className="calendar-control">
            <div> Color (Festius?) </div>
            <select onChange={(e) => this.setState({ color: e.nativeEvent.target.value })}>
              <option value={BLUE}>blue</option>
              <option value={RED}>red</option>
            </select>
          </div>
          <div className="calendar-control">
            <div> Enabled Day </div>
            <select value={enabledDay} onChange={(e) => this.setState({ enabledDay: parseInt(e.nativeEvent.target.value, 10) })}>
              {weekDays.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="calendar-control">
            <div> Frenqüència </div>
            <select onChange={this.onChangeFrequency}>
              {frequency.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="calendar-app">
          {calendar.map ((value, index) => {
            return (
              <div key={months[value]} className="calendar-container">
                <div className="calendar-month">{months[value]}</div>
                <Calendar
                  tileClassName={({ date, view }) => this.renderTileClassName(date, view, value)}
                  maxDetail="month"
                  showNavigation={false}
                  view="month"
                  showNeighboringMonth={false}
                  tileDisabled={({date, view }) => date.getDay() !== enabledDay}
                  onChange={this.onPressTile}
                  activeStartDate={new Date(2018,value,1)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
