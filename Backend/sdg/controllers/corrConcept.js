const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();


/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/


exports.getCorrelatedConcept = async (req, res, next) => {
    
    const response = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#>
	PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

    
    SELECT ?Concept ?prefLabel ?related ?relatedLabel
    WHERE {
        ?Concept a skos:Concept.
        ?Concept skos:prefLabel ?prefLabel.
  		?Concept skos:related ?related.
        ?related skos:prefLabel ?relatedLabel
  		FILTER(lang(?prefLabel)='en' && lang(?relatedLabel)='en' && STR(?prefLabel) = "`+ req.query.res + `")
    }
    `, {sources: ['http://localhost:3030/unbis/sparql'],
    });
    bindingsStream.on('data', (binding) => {
        
        let item = {
            'Concept':binding.get('Concept').value,
            'related':binding.get('related').value,
            'relatedLabel':binding.get('relatedLabel').value
        }
        response.push(item)
    });
    bindingsStream.on('end', () => {
        
        return res.json({ result: response });
    });
    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}

exports.getCorrelatedConceptLabel = async (req, res, next) => {
    
    const response = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX dcterms: <http://purl.org/dc/terms/> 
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    PREFIX unbist: <http://metadata.un.org/thesaurus/> 
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 

    SELECT ?prefLabel ?Concept
    WHERE {
  		?Concept a skos:Concept.
        ?Concept skos:prefLabel ?prefLabel.
  		FILTER(lang(?prefLabel)='en' && STR(?Concept)= "`+ req.query.res + `")
    }
    `, {sources: ['http://localhost:3030/unbis/sparql'],
    });
    bindingsStream.on('data', (binding) => {
        
        let item = {
            'Label':binding.get('prefLabel').value,
            'uri':binding.get('Concept').value
        }
        response.push(item)
    });
    bindingsStream.on('end', () => {
        
        return res.json({ result: response });
    });
    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}