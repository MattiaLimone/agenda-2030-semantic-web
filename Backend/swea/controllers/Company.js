const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();



//singleCompanyInformations
exports.singleCompanyInformations = async (req, res, next) => {
    
    const company = req.query.res;
    const result = [];
    var jsonData = {};
 


    const bindingsStream = await myEngine.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>

    SELECT ?name ?description ?foundingDate ?founder ?keyPerson ?thumbnail WHERE
    {
       OPTIONAL{<` +  company + `> rdfs:label ?name .}
       OPTIONAL{<` +  company + `> dbo:abstract ?description .}
       OPTIONAL{<` +  company + `> dbo:foundingDate ?foundingDate.}
       OPTIONAL{<` +  company + `> dbo:foundedBy ?founder.}
       OPTIONAL{<` +  company + `> dbo:keyPerson ?keyPerson.}
       OPTIONAL{<` +  company + `> dbo:thumbnail ?thumbnail.}

    FILTER ( LANG ( ?name) = 'en' )
    FILTER ( LANG ( ?description ) = 'en' )
    
    }

    LIMIT 1`, {
        sources: ['https://dbpedia.org/sparql'],
    });

    bindingsStream.on('data', (binding) => {

        
        jsonData["uri"] = company;

        
        try {
            jsonData['name'] = binding.get('name').value;
        } catch (error) {
            jsonData['name'] = ""
        }

        try {
            jsonData['description'] = binding.get('description').value;
        } catch (error) {
            jsonData['description'] = ""
        }
      
           
        try {
            jsonData['thumbnail'] = binding.get('thumbnail').value;
        } catch (error) {
            jsonData['thumbnail'] = ""
        }
        
        try {
            jsonData['foundingDate'] = binding.get('foundingDate').value;
        } catch (error) {
            jsonData['foundingDate'] = ""
        }
        
        try {
            jsonData['founder'] = binding.get('founder').value;
        } catch (error) {
            jsonData['founder'] = ""
        }

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


