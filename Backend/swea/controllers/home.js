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
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 
    
    SELECT *
    WHERE {
      ?goal rdfs:label ?labelGoal .
      ?target rdfs:label ?labelTarget .
      ?indicator rdfs:label ?labelIndicator .
      ?goal rdfs:comment ?commentGoal .
      ?target rdfs:comment ?commentTarget .
      ?indicator rdfs:comment ?commentIndicator .
      ?goal a sdg:Obiettivo.
      ?target a sdg:Target.
      ?indicator a sdg:Indicatore.
      ?target sdg:is_target_of ?goal.
      ?indicator sdg:is_indicator_of ?target.
      ?goal rdfs:label "Goal 1"@it.
    }
    `, {sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        var jsonData = {};
        jsonData['goal'] = binding.get('goal').value;
        jsonData['goal_label'] = binding.get('labelTarget').value;
        jsonData['goal_comment'] = binding.get('commentGoal').value;
        jsonData['target'] = binding.get('target').value;
        jsonData['target_label'] = binding.get('labelGoal').value;
        jsonData['target_comment'] = binding.get('commentTarget').value;
        jsonData['indicator'] = binding.get('indicator').value;
        jsonData['indicator_label'] = binding.get('labelIndicator').value;
        jsonData['indicator_comment'] = binding.get('commentIndicator').value;

        t.push(jsonData)
    });

    bindingsStream.on('end', () => {
        return res.json({ territories: t, sources: s });
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

}

