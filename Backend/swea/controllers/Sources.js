//const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const SparqlClient = require('sparql-http-client')
const QueryEngine = require('@comunica/query-sparql-link-traversal').QueryEngine;
const KeysRdfDereferenceConstantHylar =  require('@comunica/reasoning-context-entries');
const myEngine = new QueryEngine();
const N3 = require('n3');
const store = new N3.Store();

const EnergyDescription = "Renewable energy is energy that is collected from renewable resources that are naturally replenished on a human timescale. It includes sources such as sunlight, wind, rain, tides, waves, and geothermal heat. Renewable energy stands in contrast to fossil fuels, which are being used far more quickly than they are being replenished. Although most renewable energy sources are sustainable, some are not. For example, some biomass sources are considered unsustainable at current rates of exploitation. Renewable energy often provides energy in four important areas: electricity generation, air and water heating/cooling, transportation, and rural (off-grid) energy services. About 20% of humans' global energy consumption is renewables, including almost 30% of electricity. About 8% of energy consumption is traditional biomass, but this is declining. Over 4% of energy consumption is heat energy from modern renewables, such as solar water heating, and over 6% electricity. Globally there are over 10 million jobs associated with the renewable energy industries, with solar photovoltaics being the largest renewable employer. Renewable energy systems are rapidly becoming more efficient and cheaper and their share of total energy consumption is increasing, with a large majority of worldwide newly installed electricity capacity being renewable. In most countries, photovoltaic solar or onshore wind are the cheapest new-build electricity. Many nations around the world already have renewable energy contributing more than 20% of their energy supply. And many nations around the world already generate over half their electricity from renewables. National renewable energy markets are projected to continue to grow strongly in the coming decade and beyond.A few countries generate all their electricity using renewable energy.Renewable energy resources exist over wide geographical areas, in contrast to fossil fuels, which are concentrated in a limited number of countries. Deployment of renewable energy and energy efficiency technologies is resulting in significant energy security, climate change mitigation, and economic benefits. However renewables are being hindered by hundreds of billions of dollars of fossil fuel subsidies. In international public opinion surveys there is strong support for promoting renewable sources such as solar power and wind power. While many renewable energy projects are large-scale, renewable technologies are also suited to rural and remote areas and developing countries, where energy is often crucial in human development. As most of renewable energy technologies provide electricity, renewable energy is often deployed together with further electrification, which has several benefits: electricity can be converted to heat, can be converted into mechanical energy with high efficiency, and is clean at the point of consumption. In addition, electrification with renewable energy is more efficient and therefore leads to significant reductions in primary energy requirements. In 2021 China accounted for almost half of the increase in renewable electricity.";

/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/

//All EnergySources
exports.allEnergySources = async (req, res, next) => {
    
    const result = [];
    console.log("sono qui");
    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
                
        SELECT ?individual 
        WHERE { 
            ?individual rdf:type swea:Renewable_Energy_Sources.
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

//singleEnergyInf
exports.singleEnergyInf = async (req, res, next) => {
    
    const sourceRes = req.query.res;
    const result = [];
    var jsonData = {};
 

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT ?abstract ?name ?thumbnail
    WHERE
    {
       OPTIONAL{<` + sourceRes + `>  rdfs:label ?name .}
       OPTIONAL{<` + sourceRes + `> dbo:abstract ?abstract .}
       OPTIONAL{<` + sourceRes + `> dbo:thumbnail ?thumbnail.}
       

    FILTER ( LANG ( ?abstract) = 'en' )
    FILTER ( LANG ( ?name) = 'en' )
    }`, {
        sources: ['https://dbpedia.org/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        jsonData["uri"] = sourceRes;

        try {
            jsonData['name'] = binding.get('name').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        jsonData["definition"] = EnergyDescription;

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


//singleSourcesCountriesRelated
// territories in witch is applied a Renewable Source given in input
exports.singleSourceCountriesRelated = async (req, res, next) => {
    
    const sourceRes = req.query.res;
    const result = [];

    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

        SELECT ?territory ?territoryName
            WHERE {
                <` + sourceRes + `> swea:can_be_exploited_in ?territory.
                OPTIONAL{?territory swea:TerritoryName ?territoryName.}
            }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        var jsonData = {};
        try {
            jsonData['name'] = binding.get('territoryName').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        try {
            jsonData['address'] = binding.get('territory').value;
        } catch (error) {
            jsonData['address'] = ""
        }
    
        
        console.log(jsonData)

        result.push(jsonData);
    });

    bindingsStream.on('end', () => {
        // The data-listener will not be called anymore once we get here.
        console.log("Ended");

        return res.json({countries: result});

    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}


//singleSourceCriteriaRelated
// Energy Usage Critera that depends of input renewable source
exports.singleSourceCriteriaRelated = async (req, res, next) => {
    
    const sourceRes = req.query.res;

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
                <` + sourceRes + `> swea:used_based_on ?criteria.
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
            jsonData['criteria_name'] = binding.get('name').value;
        } catch (error) {
            jsonData['criteria_name'] = ""
        }
        
        try {
            jsonData['criteria_source'] = binding.get('source').value;
        } catch (error) {
            jsonData['criteria_source'] = ""
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


exports.insertSourceUtilizationCriteria = async (req, res, next) => {
    await myEngine.queryVoid(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

    INSERT DATA
    { 
      swea:criteriaX rdf:type swea:Utilization_Criteria;
                     swea:criteria_type "Ambiental" ;
                     swea:criteria_name "criterio pippo baudo";
                     swea:source "https://argomenti.ilsole24ore.com/tag/pippo-baudo" ;
                     swea:description "Pippo baudo è bellissimo";
                     swea:determined_by <http://dbpedia.org/resource/Italy>;
                     swea:influence_the_use_of <http://dbpedia.org/resource/Biomass>.
    }`, {
        sources: [store],
        rules: KeysRdfDereferenceConstantHylar.rdfs,
    });

    
    for (const quad of store)
        console.log(quad);
    return res.json({result: "ok"});
   
}



exports.describeSource = async (req, res, next) => {
    const sourceRes = req.query.res;
    const results = [];

    const endpointUrl = 'https://dbpedia.org/sparql'
    const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX dbo:  <http://dbpedia.org/ontology/>
        
        DESCRIBE  <` + sourceRes + `>
        WHERE { <` + sourceRes + `> dbo:wikiPageWikiLink ?x
        FILTER ( LANG ( ?x) = 'en' ) } LIMIT 1
    `
    
    const client = new SparqlClient({ endpointUrl })
    const stream = await client.query.select(query)
    
    var i = 0;

    stream.on('data', row => {

        if (Object.entries(row)[0][1].value != sourceRes && !results.includes(Object.entries(row)[0][1].value))
            results.push(Object.entries(row)[0][1].value);
        
    })

    stream.on('end', row => {
        return res.json({results: results});
    })

    
    stream.on('error', err => {
        console.error(err)
    })

}
