import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import { MDBContainer, MDBRow, MDBCol, MDBDataTable } from 'mdbreact';


class Stocks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      allDataItems: [],
      dataItems: [],
      symbolSearch: '',
      industrySearch: '',
      isParentState: true,
    };
    this.symbolSearchInput = this.symbolSearchInput.bind(this);
    this.industrySearchInput = this.industrySearchInput.bind(this);
  }
// the following two functions are so that the data table has the feature to be filtered twice
// once it is filtered by either stock symbol or industry a setState is changed for the display and then the data
// gets set those filteredValues, in order for it to be filtered again if the user wants to double filter
  symbolSearchInput(e) {
    const symbol = e.target.value.toString().toLowerCase();
    this.setState({symbolSearch: symbol})
    const industry = this.state.industrySearch;
    const filteredValues = this.state.allDataItems.filter(value => value.symbol.toLowerCase().indexOf(symbol) > -1)
    this.setState({
      dataItems : filteredValues.filter(value => value.industry.toLowerCase().indexOf(industry) > -1)
    })
  }

  industrySearchInput(e) {
    const industry = e.target.value.toString().toLowerCase();
    this.setState({industrySearch: industry})
    const symbol = this.state.symbolSearch;
    const filteredValues=this.state.allDataItems.filter(value => value.industry.toLowerCase().indexOf(industry) > -1)
    this.setState({
      dataItems : filteredValues.filter(value => value.symbol.toLowerCase().indexOf(symbol) > -1)
    })
  }
//fetching data for the table to display all 495 entries
  componentDidMount() {
    fetch("http://131.181.190.87:3001/all")
      .then(res => res.json())
      .then(
        (rows) => {
          rows.forEach((row) => { row.clickEvent = () => this.props.addChild(row)})
          this.setState({
              isLoaded: true,
              allDataItems: rows,
              dataItems: rows
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() { //renders the stock list page, data table and search functionality
    const { error, isLoaded, dataItems } = this.state;
      const data = {
        columns: [
          {
            label: 'Stock',
            field: 'symbol',
            sort: 'asc'
          },
          {
            label: 'Name',
            field: 'name',
            sort: 'asc'
          },
          {
            label: 'Industry',
            field: 'industry',
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
    } else if (!isLoaded) { // loading circle animation that will show as the table loads, if app cannot retrieve the data, loading circle will spin non stop
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
            <MDBRow>
              <MDBCol md="6">
                <label htmlFor="defaultFormRegisterStock" >
                  Stock Name
                </label>
                <input id="stockSearch"
                  placeholder="Search for stock"
                  className="form-control"
                  onChange={this.symbolSearchInput}
                />
              </MDBCol>

              <MDBCol md="6">
                <label htmlFor="defaultFormRegisterIndustry" >
                  Industry
                </label>
                <input id="industrySearch"
                  placeholder="Search for industry"
                  className="form-control"
                  onChange={this.industrySearchInput}
                />
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
          </MDBContainer>
        </Jumbotron>
      </div>
    );
                }
  }
}

export default Stocks