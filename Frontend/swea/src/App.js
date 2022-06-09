import * as React from 'react';
import logo from './logo.svg';
import './css/App.css';
import {TerritoryPage} from './view/territorypage';
import {SourcePage} from './view/sourcepage';
import PreLoadingPage from './view/homepage';
import Home from './view/homepage';
import Indicatori from './view/IndicatorsTier';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  const [pageid, setPageid] = React.useState(-1);
  const [homedata_source, setHomedata_source] = React.useState(null);
  const [territory_data, setTerritory_data] = React.useState(null);
  const [source_data, setSource_data] = React.useState(null);

  var changePage = (page_id, address) => {
    // IN SELECTED YOU HAVE THE SELECTED OBJECT
    let selected = null;
    var builder = null;
    if (page_id == 0) {
      setPageid(page_id); 
    }
    if (page_id == 1) {
      // Territory call
      builder = {};
      // ALPHA CALL
      fetch("http://127.0.0.1:8080/singleCountryInformations?res=" + address)
      .then(res_alpha => res_alpha.json())
      .then(
        (result_alpha) => {
          builder.name = result_alpha.name;
          builder.description = result_alpha.description;
          builder.definition = result_alpha.definition;
          builder.thumb = result_alpha.thumbnail;

          // BETA CALL
          fetch("http://127.0.0.1:8080/singleCountrySourcesRelated?res=" + address)
          .then(res_beta => res_beta.json())
          .then(
            (result_beta) => {
              builder.placedSources = result_beta.sources;

              // GAMMA CALL

              fetch("http://127.0.0.1:8080/singleCountryCriteriaRelated?res=" + address)
              .then(res_gamma => res_gamma.json())
              .then(
                (result_gamma) => {
                  builder.criterias = [[],[],[],[],[]];
                  builder.criterias[0] = result_gamma.criteria_amb;
                  builder.criterias[1] = result_gamma.criteria_fin;
                  builder.criterias[2] = result_gamma.criteria_pol;
                  builder.criterias[3] = result_gamma.criteria_soc;
                  builder.criterias[4] = result_gamma.criteria_tec;

                  fetch("http://127.0.0.1:8080/singleCountryCompaniesRelated?res=" + address)
                  .then(res_delta => res_delta.json())
                  .then(
                    (result_delta) => {
                      builder.placedCompanies = result_delta.companies;
                      setTerritory_data(builder);
                      setPageid(page_id);
                    },
                    (error_delta) => {
                      console.log("Backend error: " + error_delta);
                    }
                  )

                },
                (error_gamma) => {
                  console.log("Backend error: " + error_gamma);
                }
              )

            },
            (error_beta) => {
              console.log("Backend error: " + error_beta);
            }
          )
          
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error_alpha) => {
          console.log("Backend error: " + error_alpha);
        }
      )
    } else if (page_id == 2) {
      // Source call
      // Territory call
      builder = {};
      // ALPHA CALL
      fetch("http://127.0.0.1:8080/singleEnergyInformations?res=" + address)
      .then(res_alpha => res_alpha.json())
      .then(
        (result_alpha) => {
          builder.address = result_alpha.uri;
          builder.name = result_alpha.name;
          builder.description = result_alpha.description;
          builder.definition = result_alpha.definition;
          builder.thumb = result_alpha.thumbnail;

          // BETA CALL
          fetch("http://127.0.0.1:8080/singleSourceCountriesRelated?res=" + address)
          .then(res_beta => res_beta.json())
          .then(
            (result_beta) => {
              builder.placedTerritories = result_beta.countries;

              // GAMMA CALL

              fetch("http://127.0.0.1:8080/singleSourceCriteriaRelated?res=" + address)
              .then(res_gamma => res_gamma.json())
              .then(
                (result_gamma) => {
                  builder.criterias = [[],[],[],[],[]];
                  builder.criterias[0] = result_gamma.criteria_amb;
                  builder.criterias[1] = result_gamma.criteria_fin;
                  builder.criterias[2] = result_gamma.criteria_pol;
                  builder.criterias[3] = result_gamma.criteria_soc;
                  builder.criterias[4] = result_gamma.criteria_tec;
                  setSource_data(builder);
                  setPageid(page_id);
                },
                (error_gamma) => {
                  console.log("Backend error: " + error_gamma);
                }
              )

            },
            (error_beta) => {
              console.log("Backend error: " + error_beta);
            }
          )
          
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error_alpha) => {
          console.log("Backend error: " + error_alpha);
        }
      )
    }
  }

  var loadingData_main = () => {
    fetch("http://127.0.0.1:8080/allHomeCountryAndSources")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setHomedata_source({
            t: result.territories,
            s: result.sources
          })
          setPageid(0);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("Backend error");
          setHomedata_source({
            t: [],
            s: []
          })
        }
      )
  }
  
  if (homedata_source == null && pageid == -1) loadingData_main();

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' exact component={Home} />
          <Route path='/indicatori' exact component={Indicatori} />
        </Routes>
      </Router>
    </>
  );

}

export default App;
