const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

const TerritoryDescription = "A territory is an administrative division, usually an area that is under " +
                            "the jurisdiction of a sovereign state. In most countries, a territory is an organized division " +
                            "of an area that is controlled by a country but is not formally developed into, or incorporated into, "+
                            "a political unit of the country that is of equal status to other political units that may often be referred" +
                           " to by words such as \"provinces\" or \"regions\" or \"states\". " + 
                           " In international politics, a territory is usually either the total area from which a state may extract " + 
                           "power resources or any non-sovereign geographic area which has come under the authority of another government;" + 
                           "which has not been granted the powers of self-government normally devolved to secondary territorial divisions; or both.";

/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/

//All Country
exports.allCountry = async (req, res, next) => {
    
    const result = [];
    console.log("sono qui");
    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
                
        SELECT ?individual 
        WHERE { 
            ?individual rdf:type swea:Territory .
        } LIMIT 100`, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        
        // Obtaining values
        result.push(binding.get('individual').value);
        
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json({
            queryResult : result
        });

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}

//singleCountryInf
exports.singleCountryInf = async (req, res, next) => {
    
    const countryRes = req.query.res;
    const result = [];
    var jsonData = {};
 

    console.log(`SELECT ?abstract ?population WHERE
    {
       <` + countryRes + `> dbo:abstract ?abstract .
       <` + countryRes + `> dbo:populationTotal ?population.

    FILTER ( LANG ( ?abstract) = 'en' )
    }`);
    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT ?abstract ?name ?thumbnail
    WHERE
    {
       OPTIONAL{<` + countryRes + `>  rdfs:label ?name .}
       OPTIONAL{<` + countryRes + `> dbo:abstract ?abstract .}
       OPTIONAL{<` + countryRes + `> dbo:thumbnail ?thumbnail.}
       

    FILTER ( LANG ( ?abstract) = 'en' )
    FILTER ( LANG ( ?name) = 'en' )
    }`, {
        sources: ['https://dbpedia.org/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        jsonData["uri"] = countryRes;

        try {
            jsonData['name'] = binding.get('name').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        jsonData["definition"] = TerritoryDescription;

        try {
            jsonData['description'] = binding.get('abstract').value;
        } catch (error) {
            jsonData['description'] = ""
        }
      
           
        try {
            jsonData['thumbnail'] = binding.get('thumbnail').value;
        } catch (error) {
            jsonData['thumbnail'] = ""
        }
        
        
        console.log(jsonData)

        result.push(jsonData);
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json(jsonData);

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}


//singleCountrySourcesRelated
// Energy Source that could be exploited in a input territory
exports.singleCountrySourcesRelated = async (req, res, next) => {
    
    const countryRes = req.query.res; 
    const result = [];

    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

        SELECT ?source ?SourceName
            WHERE {
                <` + countryRes + `> swea:can_exploit ?source.
                OPTIONAL{?source swea:SourceName ?SourceName.}
            }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        var jsonData = {};

        try {
            jsonData['name'] = binding.get('SourceName').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        try {
            jsonData['address'] = binding.get('source').value;
        } catch (error) {
            jsonData['address'] = ""
        }
    
        
        console.log(jsonData)

        result.push(jsonData);
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


//singleCountryCriteriaRelated
// Energy Usage Critera that depends of input territory
exports.singleCountryCriteriaRelated = async (req, res, next) => {
    
    const countryRes = req.query.res;

    const criteria_amb = [];
    const criteria_fin = [];
    const criteria_pol = [];
    const criteria_soc = [];
    const criteria_tec = [];
 


    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

        SELECT ?criteria ?type ?name ?source ?description
            WHERE {
                <` + countryRes + `> swea:determines ?criteria.
                OPTIONAL{?criteria swea:criteria_type ?type.}
                OPTIONAL{?criteria swea:criteria_name ?name.}
                OPTIONAL{?criteria swea:source ?source.}
                OPTIONAL{?criteria swea:description ?description.}
            }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {

        var jsonData = {};

        try {
            jsonData['criteria'] = binding.get('criteria').value;
        } catch (error) {
            jsonData['criteria'] = ""
        }

        try {
            jsonData['criteria_source'] = binding.get('source').value;
        } catch (error) {
            jsonData['criteria_source'] = ""
        }

        try {
            jsonData['criteria_name'] = binding.get('name').value;
        } catch (error) {
            jsonData['criteria_name'] = ""
        }
    
        
        try {
            jsonData['criteria_description'] = binding.get('description').value;
        } catch (error) {
            jsonData['criteria_description'] = ""
        }
        
        console.log(jsonData)
        try {
            switch(binding.get('type').value){
                    case "Ambiental":
                      criteria_amb.push(jsonData);
                      break;
                    case "Economic":
                        criteria_fin.push(jsonData);
                      break;
                    case "Politic":
                        criteria_pol.push(jsonData);
                      break;
                    case "Social":
                        criteria_soc.push(jsonData);
                    break;
                    case "Technical":
                        criteria_tec.push(jsonData);
                    break;
                    default:
                      // code block
                  }
            
        } catch (error) {
            
        }
       
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json({criteria_amb: criteria_amb, criteria_fin: criteria_fin, criteria_pol: criteria_pol, criteria_soc : criteria_soc, criteria_tec : criteria_tec});

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}



//singleCountryCompanyRelated
//Company that works on a input territory
exports.singleCountryCompaniesRelated = async (req, res, next) => {
    
    const countryRes = req.query.res;
    const result = [];
    
 


    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

        SELECT ?company ?companyName
            WHERE {
                <` + countryRes + `> swea:covered_by ?company.
                OPTIONAL{?company rdfs:label ?companyName.}
                FILTER ( LANG ( ?companyName) = 'en' )
            }
   
        `, {
        sources: ['http://localhost:3000/sparql', 'https://dbpedia.org/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        var jsonData = {};
        try {
            jsonData['name'] = binding.get('companyName').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        try {
            jsonData['address'] = binding.get('company').value;
        } catch (error) {
            jsonData['address'] = ""
        }
    
        
        console.log(jsonData)

        result.push(jsonData);
        });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json({companies: result});

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}
