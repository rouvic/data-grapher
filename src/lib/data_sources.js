// --- DATA SOURCES ---
import {removeChildrenAndAdd} from "codemirror-show-hint/src/util/dom";
import app from "../main";

export class DataSource {
    toTaffy() {
        return TAFFY();
    }

    hasDetails() {
        return false;
    }
}

export class DataSourceWithDetails extends DataSource {
    hasDetails() {
        return true;
    }
}

/**
 * Analyses and parse the given JSON object content, and append records to the given taffy instance.
 */
function append(json, taffy) {
    let results;

    if (!Array.isArray(json)) {
        if (Array.isArray(json.data)) {
            results = json.data;
        }
    }
    else {
        results = json;
    }

    results.forEach(result => {
        taffy.insert(result);
    });
}

export class FromURL extends DataSourceWithDetails {
    constructor() {
        super();
        this.type = "FromURL";
        this.url = "https://example.com/my-json-data";
    }

    async toTaffy() {
        let taffy = TAFFY();

        const response = await fetch(this.url);

        console.log(response);

        if (!response.ok) {
            throw Error(response.statusText);
        }

        let json = await response.json();
        append(json, taffy);
        return taffy;
    }
}

export class FromFile extends DataSourceWithDetails {
    constructor() {
        super();
        this.type = "FromFile";
        this.files = [];
    }

    async toTaffy() {
        let taffy = TAFFY();
        let json, text;

        for (let file of this.files) {
            text = await this.readFile(file);
            json = JSON.parse(text);
            append(json, taffy);
        }


        return taffy;
    }

    readFile(file){
        return new Promise((resolve, reject) => {
            let fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result)
            };
            fr.onerror = reject;
            fr.readAsText(file);
        });
    }
}

export class HardCoded extends DataSourceWithDetails {
    constructor() {
        super();
        this.type = "HardCoded";
        // TODO: switch this to script ref
        this.code = "// insert code here\n" +
            "TAFFY()";
    }

    toTaffy() {
        return eval(this.code);
    }
}
export class WikidataQuery extends DataSourceWithDetails {

    constructor() {
        super();
        this.type = "WikidataQuery";
        this.url = "";
    }

    async toTaffy() {
        let taffy = TAFFY();

        const response = await fetch(this.url);

        if (!response.ok) {
            throw Error(response.statusText);
        }

        const json = await response.json();

        const simplifiedResults = wdk.simplify.sparqlResults(json);

        simplifiedResults.forEach(result => {
            taffy.insert(result);
        });

        return taffy;
    }
}

export class WikipediaSearch extends DataSourceWithDetails {

    constructor() {
        super();
        this.type = "WikipediaSearch";
        this.query = "";
        this.srlimit = 200;
        this.lang = "en";
    }

    async toTaffy() {
        let taffy = TAFFY();

        const endpoint = `https://${this.lang}.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=${this.srlimit}&srsearch=${this.query}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw Error(response.statusText);
        }

        const json = await response.json();

        json.query.search.forEach(result => {
            taffy.insert(result);
        });

        return taffy;
    }
}


export class HardCoded1 extends DataSource {

    constructor() {
        super();
        this.type = "HardCoded1";
    }

    toTaffy() {
        // TODO: switch this to script ref
        let taffy = TAFFY();

        // Berlioz
        taffy.insert({title: "Symphonie fantastique", date: 1830, composer: "Berlioz"});

        // Debussy
        taffy.insert({title: "La Mer", date: 1905, composer: "Debussy"});

        // Schönberg
        taffy.insert({title: "Pierrot lunaire", date: 1912, composer: "Schönberg"});

        // Ravel
        taffy.insert({title: "Daphnis et Chloe", date: 1912, composer: "Ravel"});
        taffy.insert({title: "Ma mère l'Oye", date: 1910, composer: "Ravel"});
        taffy.insert({title: "Valses nobles et sentimentales", date: 1911, composer: "Ravel"});
        taffy.insert({title: "Histoires naturelles", date: 1906, composer: "Ravel"});
        taffy.insert({title: "Gaspard de la nuit", date: 1908, composer: "Ravel"});
        taffy.insert({title: "Rhapsodie espagnole", date: 1908, composer: "Ravel"});
        taffy.insert({title: "Trois poèmes de Mallarmés", date: 1913, composer: "Ravel"});

        // Stravinsky
        taffy.insert({title: "L'oiseau de feu", date: 1910, composer: "Stravinsky"});
        taffy.insert({title: "Le Sacre du Printemps", date: 1913, composer: "Stravinsky"});
        taffy.insert({title: "Petrouchka", date: 1911, composer: "Stravinsky"});
        taffy.insert({title: "Renard", date: 1916, composer: "Stravinsky"});
        taffy.insert({title: "Le Rossignol", date: 1914, composer: "Stravinsky"});
        taffy.insert({title: "Le Chant du Rossignol", date: 1917, composer: "Stravinsky"});
        taffy.insert({title: "L'Histoire du Soldat", date: 1917, composer: "Stravinsky"});
        return taffy;
    }
}

export class HardCoded2 extends DataSource {
    constructor() {
        super();
        this.type = "HardCoded2";
    }

    toTaffy() {
        // TODO: switch this to script ref
        let taffy = TAFFY();

        // Input data
        taffy().remove();

        let firstNames = ["Alice", "Bob", "Tom", "Effie", "John", "Charles", "Elaine", "Rebecca", "Hannah"];
        let lastNames = ["Smith", "John", "Goodenough", "Carter", "Kengston", "Powel"];

        let name, dob, dod;
        for (let i = 0; i < 100; i++) {

            let r = Math.floor(Math.random() * firstNames.length);
            name = firstNames[r];
            r = Math.floor(Math.random() * lastNames.length);
            name += " ";
            name += lastNames[r];

            dob = 1500 + Math.floor(Math.random() * 500);
            dod = dob + Math.floor(Math.random() * 100);

            taffy.insert({name:name, date_of_birth:dob, date_of_death:dod});
        }

        return taffy;
    }
}

