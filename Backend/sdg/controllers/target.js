const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();


/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/


exports.getTargetList = async (req, res, next) => {
    
    const response = [];

    if (req.query.currentGoal != null) {
        const bindingsStream = await myEngine.queryBindings(`
        PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 

            SELECT ?TargetLabel ?Target ?TargetComment
            WHERE {
                ?Goal a sdg:Obiettivo.
                ?Goal rdfs:label ?GoalLabel.
                ?Target a sdg:Target.
                ?Target rdfs:comment ?TargetComment.
                ?Target rdfs:label ?TargetLabel.
                ?Goal sdg:has_target ?Target.
                FILTER(STR(?GoalLabel)= "`+ req.query.currentGoal + `")
            }
        ORDER BY ASC(?TargetLabel)
        `, {sources: ['http://localhost:3000/sparql'],
        });
        bindingsStream.on('data', (binding) => {
            
            let item = {
                'label':binding.get('TargetLabel').value,
                'target':binding.get('Target').value,
                'comment':binding.get('TargetComment').value
            }
            response.push(item)
        });
        bindingsStream.on('end', () => {
            
            return res.json({ result: response });
        });
        bindingsStream.on('error', (error) => {
            console.error(error);
        });
    } else {
        const bindingsStream = await myEngine.queryBindings(`
        PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 

            SELECT ?TargetLabel ?Target ?TargetComment
            WHERE {
                ?Goal a sdg:Obiettivo.
                ?Goal rdfs:label ?GoalLabel.
                ?Target a sdg:Target.
                ?Target rdfs:comment ?TargetComment.
                ?Target rdfs:label ?TargetLabel.
                ?Goal sdg:has_target ?Target.
            }
        ORDER BY ASC(?TargetLabel)
        `, {sources: ['http://localhost:3000/sparql'],
        });
        bindingsStream.on('data', (binding) => {
            
            let item = {
                'label':binding.get('TargetLabel').value,
                'target':binding.get('Target').value,
                'comment':binding.get('TargetComment').value
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

}
