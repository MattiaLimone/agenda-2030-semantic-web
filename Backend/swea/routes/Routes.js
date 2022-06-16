const express = require("express");
const router = express.Router();

const tryController = require("../controllers/try");

const homeController = require("../controllers/home");
const goalController = require("../controllers/goal")
const correlatedConceptController = require("../controllers/corrConcept");
const indicatorController = require("../controllers/indicatori");
const subjectController = require("../controllers/subject");
const tagetController = require("../controllers/target");

router.get("/trytest", tryController.test);
router.get("/localTest", tryController.localOntology);

//home Routes
router.get("/homepage", homeController.getData);
//goal Routes
router.get("/getGoalInfo", goalController.getGoalData);
router.get("/getTargetInfo", goalController.getTargetData);
router.get("/getSubjectInfo", goalController.getSubjectData);
//Target Routes
router.get("/getTargetList", tagetController.getTargetList);
//concepts Routes
router.get("/getCorConcept", correlatedConceptController.getCorrelatedConcept);
router.get("/getMetaCorConceptLabel", correlatedConceptController.getCorrelatedConceptLabel);
//indicators Routes
router.get("/getIndicators", indicatorController.getIndicators);
router.get("/getTiers", indicatorController.getTiers);
router.get("/getAllIndicators", indicatorController.getAllIndicators);
//
router.get("/getSubjectList", subjectController.getSubjectList);
router.get("/getGoalList", subjectController.getGoalList);
router.get("/askGoalFromSubject", subjectController.askGoalFromSubject);

module.exports = router;