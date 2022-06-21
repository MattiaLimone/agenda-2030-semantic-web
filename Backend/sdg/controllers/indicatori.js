const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();


/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http Ontology\swea.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/


exports.getIndicators = async (req, res, next) => {

    const response = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 
    PREFIX dbo: <http://dbpedia.org/ontology/>
    
    SELECT ?Indicator ?IndicatorLabel ?IndicatorComment ?Tier ?source ?TierComment ?TierLabel ?agency ?LabelAgency
    WHERE {
    	?Target a sdg:Target.
  		?Target rdfs:label "`+ req.query.res + `".
  		?Indicator a sdg:Indicatore.
      	?Indicator rdfs:label ?IndicatorLabel.
  		?Indicator rdfs:comment ?IndicatorComment.
  		?Indicator sdg:has_source ?source.
  		?Tier a sdg:Livello_Indicatore.
  		?Tier rdfs:comment ?TierComment.
  		?Tier rdfs:label ?TierLabel.
        ?Indicator sdg:has_classification ?Tier.
  		?Indicator sdg:is_indicator_of ?Target.
  		?agency a dbo:Organisation.
  		?agency rdfs:label ?LabelAgency.
  		?Indicator sdg:has_agency ?agency.	
    }
    ORDER BY ASC(?IndicatorLabel)
    `, {
        sources: ['http://localhost:3000/sparql'],
    });
    bindingsStream.on('data', (binding) => {

        let item = {
            'indicator': binding.get('Indicator').value,
            'label': binding.get('IndicatorLabel').value,
            'comment': binding.get('IndicatorComment').value,
            'tier': binding.get('Tier').value,
            'source': binding.get('source').value,
            'tierLabel': binding.get('TierLabel').value,
            'tierComment': binding.get('TierComment').value,
            'agency': binding.get('agency').value,
            'labelAgency': binding.get('LabelAgency').value,
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

exports.getTiers = async (req, res, next) => {

    const response = [];

    const bindingsStream = await myEngine.queryBindings(`
    PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 

    SELECT DISTINCT ?TierLabel ?definition ?TierDescr
    WHERE {
    	?Target a sdg:Target.
  		?Target rdfs:label "`+ req.query.res + `".
  		?Indicator a sdg:Indicatore.
      	?Indicator rdfs:label ?IndicatorLabel.
  		?Indicator rdfs:comment ?IndicatorComment.
  		?Indicator sdg:has_source ?source.
  		?Tier a sdg:Livello_Indicatore.
  		?Tier rdfs:comment ?TierComment.
  		?Tier rdfs:label ?TierLabel.
  		?Tier rdfs:isDefinedBy ?definition.
  		?Tier rdfs:comment ?TierDescr.
        ?Indicator sdg:has_classification ?Tier.
  		?Indicator sdg:is_indicator_of ?Target.	
    }
ORDER BY ASC(?TierLabel)
    `, {
        sources: ['http://localhost:3000/sparql'],
    });
    bindingsStream.on('data', (binding) => {

        let item = {
            'tier': binding.get('TierLabel').value,
            'definition': binding.get('definition').value,
            'description': binding.get('TierDescr').value,
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

exports.getAllIndicators = async (req, res, next) => {

    const response = [];

    if (req.query.CurrentTarget != null) {
        const bindingsStream = await myEngine.queryBindings(`
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 
    
        SELECT ?IndicatorLabel ?IndicatorComment ?TierLabel ?IndicatorSource
        WHERE {
            ?Indicator a sdg:Indicatore.
            ?Target a sdg:Target.
            ?Target rdfs:label "`+ req.query.CurrentTarget + `"@en.
            ?Tier a sdg:Livello_Indicatore.
            ?Tier rdfs:label ?TierLabel.
                  
            ?Indicator sdg:has_classification ?Tier.          
            ?Target sdg:has_indicator ?Indicator.
    
            ?Indicator rdfs:label ?IndicatorLabel.
            ?Indicator rdfs:comment ?IndicatorComment.
            ?Indicator sdg:has_source ?IndicatorSource.
        }
        ORDER BY ASC(?IndicatorLabel)
        `, {
            sources: ['http://localhost:3000/sparql'],
        });
        bindingsStream.on('data', (binding) => {

            let item = {
                'indicator': binding.get('IndicatorLabel').value,
                'comment': binding.get('IndicatorComment').value,
                'tier': binding.get('TierLabel').value,
                'source': binding.get('IndicatorSource').value
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
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX sdg: <http://www.semanticweb.org/mlimo/ontologies/2022/4/sdg#> 
    
        SELECT ?IndicatorLabel ?IndicatorComment ?TierLabel ?IndicatorSource
        WHERE {
            ?Indicator a sdg:Indicatore.
            ?Target a sdg:Target.
            ?Tier a sdg:Livello_Indicatore.
            ?Tier rdfs:label ?TierLabel.
                  
            ?Indicator sdg:has_classification ?Tier.          
            ?Target sdg:has_indicator ?Indicator.
    
            ?Indicator rdfs:label ?IndicatorLabel.
            ?Indicator rdfs:comment ?IndicatorComment.
            ?Indicator sdg:has_source ?IndicatorSource.
        }
        ORDER BY ASC(?IndicatorLabel)
        `, {
            sources: ['http://localhost:3000/sparql'],
        });
        bindingsStream.on('data', (binding) => {

            let item = {
                'indicator': binding.get('IndicatorLabel').value,
                'comment': binding.get('IndicatorComment').value,
                'tier': binding.get('TierLabel').value,
                'source': binding.get('IndicatorSource').value
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
