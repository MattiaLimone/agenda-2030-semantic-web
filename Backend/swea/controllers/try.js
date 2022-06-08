const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

//exernal end point
exports.test = async (req, res, next) => {
    
    const result = [];

    const bindingsStream = await myEngine.queryBindings(`
        SELECT ?o WHERE {
            <http://dbpedia.org/resource/Alfa_Romeo_1900> <http://www.w3.org/2002/07/owl#sameAs> ?o.
        } LIMIT 3`, {
        sources: ['https://dbpedia.org/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        
        // Obtaining values
        result.push(binding.get('o').value);
        
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

/*to set a local end point from a ttl file, follow this link: 
    https://comunica.dev/docs/query/getting_started/setup_endpoint/

    Command 1 - require package: npm install -g @comunica/query-sparql-file
    Command 2 - open "End Point Server" - comunica-sparql-file-http path/to/my/file.ttl

    IMPORTANT: the exported file from protege, must be a .ttl
    IMPORTANT: Make sure that the relative or absolute path of the file does not contain spaces...*/

exports.localOntology = async (req, res, next) => {
    
    const result = [];

    const bindingsStream = await myEngine.queryBindings(`
            PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT ?s WHERE {
            ?s ?p ?o
            } LIMIT 100`, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        
        // Obtaining values
        result.push(binding.get('s').value);
        
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

exports.localOntology = async (req, res, next) => {
    
    const result = [];

    const bindingsStream = await myEngine.queryBindings(`
            PREFIX swea: <http://www.semanticweb.org/abate/ontologies/2022/4/swea#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT ?s WHERE {
            ?s ?p ?o
            } LIMIT 100`, {
        sources: ['http://localhost:3000/sparql'],
    });

    bindingsStream.on('data', (binding) => {
        
        // Obtaining values
        result.push(binding.get('s').value);
        
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

exports.allCountry = async (req, res, next) => {
    
    const result = [];

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