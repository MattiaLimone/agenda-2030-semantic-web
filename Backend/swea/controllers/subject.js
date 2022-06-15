const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();


/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/

/*
*/
exports.getSubjectList = async (req, res, next) => {

    const response = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    PREFIX unbist: <http://metadata.un.org/thesaurus/> 
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 

    SELECT DISTINCT ?prefLabel
    WHERE {
    ?Concept a skos:Concept.
    ?Concept skos:prefLabel ?prefLabel.
    FILTER(lang(?prefLabel)='en')
    }
    ORDER BY ?prefLabel
    `, {
        sources: ['http://localhost:3030/unbis/sparql'],
    });
    bindingsStream.on('data', (binding) => {
        let item = {
            "label": binding.get('prefLabel').value,
            
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
exports.getGoalList = async (req, res, next) => {

    const response = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#>

    SELECT DISTINCT ?label
    WHERE{
    ?goal a sdg:Obiettivo.
    ?goal rdfs:label ?label
    }
    `, {
        sources: ['http://localhost:3000/sparql'],
    });
    bindingsStream.on('data', (binding) => {
        let item = {
            "label": binding.get('label').value,
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
exports.askGoalFromSubject = async (req, res, next) => {

    const response = [];

    const bindingsStream = await myEngine.queryBoolean(`
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
    PREFIX unbist: <http://metadata.un.org/thesaurus/> 
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#>

    ASK {
        ?gaol a sdg:Obiettivo.
        ?goal sdg:has_subject ?subject.
        ?subject skos:prefLabel "ABACA"@en.
      }
    `, {
        sources: ['http://localhost:3000/sparql'],
    });
    return res.json({ 'answer': bindingsStream });
}