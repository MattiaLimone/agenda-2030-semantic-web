const express = require("express");
const router = express.Router();

const tryController = require("../controllers/try");

const homeController = require("../controllers/home");
const territoryController = require("../controllers/Territory");
const sourcesController = require("../controllers/Sources");
const companyController = require("../controllers/Company");
const criteriaController = require("../controllers/Criteria");

router.get("/trytest", tryController.test);
router.get("/localTest", tryController.localOntology);

//home Routes
router.get("/allHomeCountryAndSources", homeController.allHomeCountryAndSources);

//Territory Routes
router.get("/allCountry", territoryController.allCountry);
router.get("/singleCountryInformations", territoryController.singleCountryInf);
router.get("/singleCountrySourcesRelated", territoryController.singleCountrySourcesRelated);
router.get("/singleCountryCriteriaRelated", territoryController.singleCountryCriteriaRelated);
router.get("/singleCountryCompaniesRelated", territoryController.singleCountryCompaniesRelated);

//Sources Routes
router.get("/allSources", sourcesController.allEnergySources);
router.get("/singleEnergyInformations", sourcesController.singleEnergyInf);
router.get("/singleSourceCountriesRelated", sourcesController.singleSourceCountriesRelated);
router.get("/singleSourceCriteriaRelated", sourcesController.singleSourceCriteriaRelated);
router.get("/describeSource", sourcesController.describeSource);
router.get("/insertSourceUtilizationCriteria", sourcesController.insertSourceUtilizationCriteria);


//Criteria Routes
router.get("/singleCriteriaInformation", criteriaController.singleCriteriaInformations);
router.get("/singleCriteriaTerritoriesRelated", criteriaController.singleCriteriaTerritoriesRelated);
router.get("/singleCriteriaSourcesRelated", criteriaController.singleCriteriaSourcesRelated);
router.get("/singleCriteriaEcosystemsAndDevicesAndLawsRelated", criteriaController.singleCriteriaEcosystemsAndDevicesAndLawsRelated);
router.get("/singleCriteriaPricesRelated", criteriaController.singleCriteriaPricesRelated);
router.get("/singleCriteriaMeasuresRelated", criteriaController.singleCriteriaMeasuresRelated);



//Company Routes
router.get("/singleCompanyInformations", companyController.singleCompanyInformations);

module.exports = router;