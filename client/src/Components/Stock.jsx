import React from 'react'
import DatePicker from "react-datepicker";
import { Line } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css";
import Jumbotron from 'react-bootstrap/Jumbotron'
import { MDBContainer, MDBRow, MDBCol, MDBDataTable, MDBBtn } from 'mdbreact';
class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            allDataItems: [],
            dataItems: [],
            isParentState: true,
            startDate: new Date(),
            dataLine: {}
        };
    }

    handleChange = date => {
        this.setState({
            startDate: date // this has to be able to adjust the table for 100days to selected amount 3/23 back to selected date. 
        })
        const filteredValues = this.state.allDataItems.filter(value => new Date(Date.parse(value.timestamp)) >= date)
        //filteredValues contains a function that pulls the date chosen and changes the state of date in order to adjust the graph and table
        var labelsValue = []
        var closingPrices = []
        filteredValues.forEach((row) => {
            labelsValue.push(row.date);
            closingPrices.push(row.close);
        });
        this.setState({
            dataItems: filteredValues,
            dataLine: {
                labels: labelsValue,
                datasets: [
                    {
                        label: "Closing Price",
                        fill: true,
                        lineTension: 0.3,
                        backgroundColor: "rgba(184, 185, 210, .3)",
                        borderColor: "rgb(35, 26, 136)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgb(35, 26, 136)",
                        pointBackgroundColor: "rgb(255, 255, 255)",
                        pointBorderWidth: 10,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgb(0, 0, 0)",
                        pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: closingPrices
                    }],
            }
        })
        //const filterDateString = date.toLocaleDateString();

        // console.log(date.toLocaleDateString()); //test console log to see if it chosen date shows
    }
    componentDidMount() {
        fetch("http://131.181.190.87:3001/history?symbol=" + this.props.symbol) // adds the symbol that was chosen from stock list page, to the end of this url to pull the dates from the API
            .then(res => res.json())
            .then(
                (rows) => {
                    rows = rows.sort((a, b) => { return a.timestamp < b.timestamp ? -1 : 1 });
                    var labelsValue = []
                    var closingPrices = []
                    rows.forEach((row) => {
                        var v = new Intl.DateTimeFormat('en-AU').format(new Date(Date.parse(row.timestamp))); // the AU changes the format of the date to Australian from American
                        row.date = v;
                        labelsValue.push(v);
                        row.volumeString = row.volumes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); //adds a comma for every 3 digits from the right
                        closingPrices.push(row.close);
                    });
                    // below the setState will allow the graph to be displayed after the user chosen a stock from the Stocks.jsx component
                    this.setState({ 
                        isLoaded: true,
                        allDataItems: rows,
                        dataItems: rows,
                        dataLine: {
                            labels: labelsValue,
                            datasets: [
                                {
                                    label: "Closing Price",
                                    fill: true,
                                    lineTension: 0.3,
                                    backgroundColor: "rgba(184, 185, 210, .3)",
                                    borderColor: "rgb(35, 26, 136)",
                                    borderCapStyle: "butt",
                                    borderDash: [],
                                    borderDashOffset: 0.0,
                                    borderJoinStyle: "miter",
                                    pointBorderColor: "rgb(35, 26, 136)",
                                    pointBackgroundColor: "rgb(255, 255, 255)",
                                    pointBorderWidth: 10,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                                    pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                                    pointHoverBorderWidth: 2,
                                    pointRadius: 1,
                                    pointHitRadius: 10,
                                    data: closingPrices
                                }],
                        }
                    });
                },
                (error) => { // if an error occurs while loading of the stock details page
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() { // render function to display the stock details page
        const { error, isLoaded, dataItems } = this.state;
        const data = {
            columns: [
                {
                    label: 'Date',
                    field: 'date',
                    sort: 'asc'
                },
                {
                    label: 'Open',
                    field: 'open',
                    sort: 'asc'
                },
                {
                    label: 'High',
                    field: 'high',
                    sort: 'asc'
                },
                {
                    label: 'Low',
                    field: 'low',
                    sort: 'asc'
                },
                {
                    label: 'Close',
                    field: 'close',
                    sort: 'asc'
                },
                {
                    label: 'Volumes',
                    field: 'volumeString',
                    sort: 'asc'
                }
            ],
            rows: dataItems,
        };
        if (error) {
            return <div><Jumbotron fluid>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol>Error: {error.message}</MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Jumbotron></div>;
        } else if (!isLoaded) {
            return <div><Jumbotron fluid>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol>
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </Jumbotron></div>;
        } else {
            return (
                <div>
                    <Jumbotron fluid>
                        <MDBContainer>
                            <MDBBtn color="primary" size="sm" onClick={this.props.restoreParent}>Go Back</MDBBtn>
                            <MDBRow>
                                <MDBCol> Choose a date from: &nbsp; &nbsp;
                                <DatePicker className="form-control"
                                        selected={this.state.startDate} // DatePicker component is what allows the user to choose the date to begin with for the chosen stock
                                        onChange={this.handleChange}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>

                                <MDBCol>
                                    <p className="center"> </p>
                                    <p>Historical stock prices for: {this.props.name}</p>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <MDBDataTable
                                        striped
                                        bordered
                                        small
                                        data={data} className="w-100"
                                        searching={false}
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <Line data={this.state.dataLine} options={{ responsive: true }} />
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </Jumbotron>
                </div>
            )
        }
    }
}

export default Stock