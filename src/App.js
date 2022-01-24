import React, { Component } from 'react';
import CovidData from './components/CovidData';
import './App.css';
import { Chart } from "react-google-charts";



export default class App extends Component {

  state = {
    country: "Poland",
    date: "",
    past: "",
    dataVisible: false,
    images: [],
    selectedImage: "",

    population: "",
    confirmed: "",
    deaths: "",
    confirmed_daily: "",
    deaths_daily: "",
    recovered: "",
    recovered_daily: "",
    option: {
      chart: {
        title: 'Daily deaths and confirmed infections during the year',
      }


    },

    data: [
    ]
  }

  handleChange = (event) => {
    if (event.target.type === "text") {
      this.setState({
        country: event.target.value
      })
    } else {

      const toMiliseconds = event.target.value
      const dateInMiliseconds = Date.parse(toMiliseconds)
      const dateInUTC = new Date(dateInMiliseconds).toUTCString()
      const calculatingPast = new Date(dateInUTC)
      calculatingPast.setDate(calculatingPast.getDate() - 365)
      const past = calculatingPast.toISOString().slice(0, 10)
      console.log(past)

      this.setState({
        date: event.target.value,
        past
      })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const countryURL =
      "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/covid-19-qppza/service/REST-API/incoming_webhook/countries_summary?min_date=" +
      this.state.past + "T00:00:00.000Z&max_date=" + this.state.date + "T00:00:00.000Z&country=" + this.state.country;

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(countryURL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        const tempData = result;

        let dataList = [
          [
            { type: "string", label: "Day" },
            "Confirmed daily  ",
            "Deaths daily  ",
          ],
        ]

        for (var i = 0; i < 364; i++) {

          let day = tempData[i].date;
          let trueDay = day.toString().slice(0, 10);
          // console.log(trueDay);

          dataList.push([trueDay, tempData[i].confirmed_daily, tempData[i].deaths_daily])
        }

        console.log(dataList);

        const dataObject = result[364]
        if (dataObject) {
          this.setState({
            dataVisible: true,
            population: dataObject.population,
            confirmed: dataObject.confirmed,
            deaths: dataObject.deaths,
            confirmed_daily: dataObject.confirmed_daily,
            deaths_daily: dataObject.deaths_daily,
            recovered: dataObject.recovered,
            recovered_daily: dataObject.recovered_daily,
            data: dataList,

            selectedImage: this.state.images[this.state.country + ".png"]
          })
        }
      })
      .catch((error) => console.log("error", error));

  }

  importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }

  componentDidMount = () => {

    const latestDate = new Date();
    latestDate.setDate(latestDate.getDate() - 1);
    const yesterday = latestDate.toISOString().slice(0, 10);

    const calculatingPast = new Date();
    calculatingPast.setDate(calculatingPast.getDate() - 365);
    const past = calculatingPast.toISOString().slice(0, 10);

    this.setState({
      date: yesterday,
      images: this.importAll(require.context('./countries', false, /\.(png|jpe?g|svg)$/)),
      past: past
    })

  }

  render() {

    return (

      <div id="main" >
        <header>

          <form onSubmit={this.handleSubmit}>
            <label>Insert country name:</label>
            <br />
            <input
              type="text"
              id="country"
              value={this.state.country}
              onChange={this.handleChange}
            >
            </input>
            <br />

            <label>Pick a date:</label>
            <br />
            <input
              id="date"
              type="date"
              value={this.state.date}
              onChange={this.handleChange}></input>
            <br />

            <button>Ask the server</button>
          </form>
        </header>


        <body>
          <img src={this.state.selectedImage} alt=""></img>
          {
            this.state.dataVisible &&
            <div className='data'>
              <CovidData data={this.state} />
            </div>
          }

          {
            this.state.dataVisible &&
            <Chart
              className='chart'
              chartType="Line"
              data={this.state.data}
              width="1000px"
              height="600px"
              legendToggle
              options={this.state.option}
            />
          }

        </body>
      </div>
    )
  }
}