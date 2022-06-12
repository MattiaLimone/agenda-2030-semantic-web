const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();


/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/


exports.getGoalData = async (req, res, next) => {
    
    const response = [];

    const bindingsStream = await myEngine.queryQuads(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 
    
    DESCRIBE ?goal
    WHERE {
        ?goal a sdg:Obiettivo.
        ?goal rdfs:label "`+req.query.res+`"@it .
    }
    `, {sources: ['http://localhost:3000/sparql'],
    });
    bindingsStream.on('data', (quad) => {
        let item = {
            "subject": quad.subject.value,
            "predicate": quad.predicate.value,
            "object":quad.object.value
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

exports.getTargetData = async (req, res, next) => {
    
    const response = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 
    
    SELECT ?target ?labelTarget ?commentTarget
    WHERE {
        ?goal a sdg:Obiettivo.
        ?goal rdfs:label "`+req.query.res+`"@it .
        ?target a sdg:Target.
        ?target sdg:is_target_of ?goal.
        ?target rdfs:label ?labelTarget.
        ?target rdfs:comment ?commentTarget.
    }
    `, {sources: ['http://localhost:3000/sparql'],
    });
    bindingsStream.on('data', (binding) => {
        const REGEXP = /\d+/g;
        index = binding.get('labelTarget').value.match(REGEXP)[1]
        
        let item = {
            'index': index,
            'target':binding.get('target').value,
            'label':binding.get('labelTarget').value,
            'comment':binding.get('commentTarget').value
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
