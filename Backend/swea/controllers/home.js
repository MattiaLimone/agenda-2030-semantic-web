const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();


/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/


  
    

exports.allHomeCountryAndSources = async (req, res, next) => {
    const t = [], s = []; 

    const bindingsStream = await myEngine.queryBindings(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>

        SELECT ?individual ?name ?type
            WHERE {
            { 
                ?individual rdf:type swea:Territory.
                ?individual rdf:type ?type.
                ?individual swea:TerritoryName ?name.
                FILTER (?type = swea:Territory)
            }
            UNION  { 
                    ?individual rdf:type swea:Renewable_Energy_Sources.
                    ?individual rdf:type ?type.
                    ?individual swea:SourceName ?name.
                    FILTER (?type = swea:Renewable_Energy_Sources)
            }

        }
   
        `, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        var jsonData = {};
        jsonData['name'] = binding.get('name').value;
        jsonData['address'] = binding.get('individual').value;
        if (binding.get('type').value == "http://www.semanticweb.org/abate/ontologies/2022/4/swea#Territory")
            t.push(jsonData);
        else s.push(jsonData);
    });

    bindingsStream.on('end', () => {
        return res.json({territories: t, sources: s});
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}

