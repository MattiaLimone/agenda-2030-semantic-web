const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/


//singleCriteriaInf
exports.singleCriteriaInformations = async (req, res, next) => {
    
    const criteriaRes = req.query.res;
    var result = null;
    var jsonData = {};
 

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
    
    SELECT ?name ?type ?description ?source  WHERE
    {
       OPTIONAL{` + criteriaRes + ` swea:criteria_type ?type .}
       OPTIONAL{` + criteriaRes + `  swea:criteria_name ?name .}
       OPTIONAL{` + criteriaRes + `  swea:description ?description .}
       OPTIONAL{` + criteriaRes + ` swea:source ?source.}
    
    }`, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {

        jsonData["address"] = criteriaRes;

        try {
            jsonData['type'] = binding.get('type').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        try {
            jsonData['name'] = binding.get('name').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        try {
            jsonData['description'] = binding.get('description').value;
        } catch (error) {
            jsonData['description'] = ""
        }
        
        try {
            jsonData['source'] = binding.get('source').value;
        } catch (error) {
            jsonData['source'] = ""
        }

        console.log(jsonData.type);
        
        if (result == null) result = {...jsonData}
        else {
            var type = result.type;
            result.type = type + ", " + jsonData.type;
        }
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json(result);

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}


//singleCountrySourcesRelated
// Energy Source that could be exploited in a input territory
exports.singleCriteriaTerritoriesRelated = async (req, res, next) => {
    
    const criteriaRes = req.query.res; 
    const result = [];
 

  console.log("SELECT ?territory ?territoryName WHERE { " + 
        + criteriaRes + " swea:determined_by ?territory."+
     " OPTIONAL{?territory swea:TerritoryName ?territoryName.} } ");

    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

        SELECT ?territory ?territoryName
            WHERE {
                ` + criteriaRes + ` swea:determined_by ?territory.
                OPTIONAL{?territory swea:TerritoryName ?territoryName.}
            }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {

        try {
            result.push(binding.get('territoryName').value); 
        } catch (error) {
            result.push(""); 
        }
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json({territories: result});

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}


// Energy Source that could be featured by a input criteria
exports.singleCriteriaSourcesRelated = async (req, res, next) => {
    
    const criteriaRes = req.query.res; 
    const result = [];
 


    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

        SELECT ?source ?SourceName
            WHERE {
                ` + criteriaRes + ` swea:influences_the_use_of ?source.
                OPTIONAL{?source swea:SourceName ?SourceName.}
            }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {

        try {
            result.push(binding.get('SourceName').value);
        } catch (error) {
            result.push("");
        }

    
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json({sources: result});

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}



exports.singleCriteriaEcosystemsAndDevicesAndLawsRelated = async (req, res, next) => {
    const e = [], d = [], n = []; 
    const criteriaRes = req.query.res; 

    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
       
       
        SELECT ?type ?individual 
        WHERE {{
                ` + criteriaRes + ` swea:featured_by_environment ?individual.
                ?individual rdf:type ?type.
                FILTER (?type = swea:Ecosystem)
            }
            UNION  { 
                ` + criteriaRes + ` swea:featured_by_device ?individual.
                ?individual rdf:type ?type.
                FILTER (?type = swea:Device)
            }
            UNION  { 
                ` + criteriaRes + ` swea:featured_by_norm ?individual.
                ?individual rdf:type ?type.
                FILTER (?type = swea:Legal_Norm)
            }


        }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        var jsonData = {};
        
        try {
            jsonData['type'] = binding.get('type').value;
        } catch (error) {
            jsonData['type'] = ""
        }

        try {
            jsonData['individual'] = binding.get('individual').value;
        } catch (error) {
            jsonData['individual'] = ""
        }


        if (binding.get('type').value == "http://www.semanticweb.org/abate/ontologies/2022/4/swea#Device")
            d.push(jsonData);
        else if (binding.get('type').value == "http://www.semanticweb.org/abate/ontologies/2022/4/swea#Ecosystem") e.push(jsonData);
        else n.push(jsonData);
    });

    bindingsStream.on('end', () => {
        return res.json({ecosystems: e, devices: d, norms: n});
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}


exports.singleCriteriaPricesRelated = async (req, res, next) => {
    const prices = []; 
    const criteriaRes = req.query.res; 

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
   
   
    SELECT ?price ?priceDescription  ?priceValue ?priceCurrency
    WHERE {
            ` + criteriaRes +` swea:price ?price.
             OPTIONAL{?price swea:price_description ?priceDescription.}
             OPTIONAL{?price swea:amount ?priceValue.}
             OPTIONAL{?price swea:currency ?priceCurrency.}
        
        }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        var jsonData = {};
        
        try {
            jsonData['value'] = binding.get('priceValue').value;
        } catch (error) {
            jsonData['value'] = ""
        }

        try {
            jsonData['currency'] = binding.get('priceCurrency').value;
        } catch (error) {
            jsonData['currency'] = ""
        }

        try {
            jsonData['description'] = binding.get('priceDescription').value;
        } catch (error) {
            jsonData['description'] = ""
        }

         prices.push(jsonData);
    });

    bindingsStream.on('end', () => {
        return res.json({prices: prices});
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}


exports.singleCriteriaMeasuresRelated = async (req, res, next) => {
    const measures = []; 
    const criteriaRes = req.query.res; 

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
   
   
    SELECT ?measure ?measureDescription  ?measureValue ?measureUnit
    WHERE {
            ` + criteriaRes +` swea:measured_by ?measure.
             OPTIONAL{?measure swea:measure_description ?measureDescription.}
             OPTIONAL{?measure swea:value ?measureValue.}
             OPTIONAL{?measure swea:unit ?measureUnit.}
        
        }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {

        var jsonData = {};
        
        try {
            jsonData['value'] = binding.get('measureValue').value;
        } catch (error) {
            jsonData['value'] = ""
        }

        try {
            jsonData['unit'] = binding.get('measureUnit').value;
        } catch (error) {
            jsonData['currency'] = ""
        }

        try {
            jsonData['description'] = binding.get('measureDescription').value;
        } catch (error) {
            jsonData['description'] = ""
        }

        measures.push(jsonData);
    });

    bindingsStream.on('end', () => {
        return res.json({measures: measures});
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}
