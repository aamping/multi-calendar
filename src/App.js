import React, { Component } from 'react';
import Calendar from 'react-calendar';

const BLUE = "blue";
const RED = "red";
const weekDays = [1,2,3,4,5,6,7];

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
    value: new Date(2018,0,1),
    calendarData: initialState,
    color: BLUE,
    enabledDay: 1,
  }

  onChange = value => {
    const data = new Date(value);
    const { calendarData, color } = this.state;
    switch (color) {
      case BLUE: {
        if (calendarData[data.getMonth()].diesHabils.includes(data.getDate())) {
          calendarData[data.getMonth()].diesHabils.splice(calendarData[data.getMonth()].diesHabils.indexOf(data.getDate()),1)
        } else {
          calendarData[data.getMonth()].diesHabils.push(data.getDate());
          calendarData[data.getMonth()].diesHabils.sort((a, b) => a - b);
          if (calendarData[data.getMonth()].diesFestius.includes(data.getDate())) {
            calendarData[data.getMonth()].diesFestius.splice(calendarData[data.getMonth()].diesFestius.indexOf(data.getDate()),1)
          }
        }
        break;
      }
      case RED: {
        if (calendarData[data.getMonth()].diesFestius.includes(data.getDate())) {
          calendarData[data.getMonth()].diesFestius.splice(calendarData[data.getMonth()].diesFestius.indexOf(data.getDate()),1)
        } else {
          calendarData[data.getMonth()].diesFestius.push(data.getDate());
          calendarData[data.getMonth()].diesFestius.sort((a, b) => a - b);
          if (calendarData[data.getMonth()].diesHabils.includes(data.getDate())) {
            calendarData[data.getMonth()].diesHabils.splice(calendarData[data.getMonth()].diesHabils.indexOf(data.getDate()),1)
          }
        }
        break;
      }
      default:
        break;
    }
    this.setState({ calendarData });
  }

  renderTileClassName(date, view, index, value) {
    if (date.getMonth() === index && value.diesHabils.includes(date.getDate())) {
      return 'calendar-tile-active';
    } else if (date.getMonth() === index && value.diesFestius.includes(date.getDate())) {
      return 'calendar-tile-holiday';
    } return null;
  }

  render() {
    const { value, calendarData, color, enabledDay } = this.state;
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
            <select onChange={(e) => this.setState({ enabledDay: parseInt(e.nativeEvent.target.value, 10) })}>
              {weekDays.map(value => (
                <option value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          {calendarData.map ((value, index) => {
            return (
              <div>
              <div className="calendar-month">{value.mes}</div>
              <Calendar
                tileClassName={({ date, view }) => this.renderTileClassName(date, view, index, value)}
                maxDetail="month"
                showNavigation={false}
                view="month"
                showNeighboringMonth={false}
                tileDisabled={({date, view }) => date.getDay() !== enabledDay}
                onChange={this.onChange}
                activeStartDate={new Date(2018,index,1)}
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
