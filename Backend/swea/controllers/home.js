const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();


/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/


exports.getData = async (req, res, next) => {
    const response = [];
    
    const goal = [];
    const target = [];
    const indicator = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 
    
    SELECT *
    WHERE {
        ?goal a sdg:Obiettivo.
        ?goal rdfs:label ?labelGoal .
        ?goal rdfs:comment ?commentGoal .
        ?goal sdg:has_image ?imageGoal .
        ?goal sdg:has_source ?sourceGoal.
    }
    `, {sources: ['http://localhost:3000/sparql'],
    });
    bindingsStream.on('data', (binding) => {
        const REGEXP = /\d+/g;
        index = binding.get('labelGoal').value.match(REGEXP)
        let goal = {
            'index':parseInt(index),
            'goal_uri':binding.get('goal').value,
            'goal_label':binding.get('labelGoal').value,
            'goal_comment':binding.get('commentGoal').value,
            'goal_image':binding.get('imageGoal').value,
            'goal_source':binding.get('sourceGoal').value
        }
        response.push(goal)
    });
    bindingsStream.on('end', () => {
        
        return res.json({ result: response });
    });
    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}


