// --- DATA SOURCES ---
export class DataSource {
    toTaffy() {
        return TAFFY();
    }
}

export class HardCoded1 extends DataSource {
    toTaffy() {
        let taffy = TAFFY();

        // Input data
        taffy().remove();

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
    toTaffy() {
        let taffy = TAFFY();

        // Input data
        taffy().remove();

        // Berlioz
        taffy.insert({title: "Symphonie fantastique", date: "1830", composer: "Berlioz"});

        // Debussy
        taffy.insert({title: "La Mer", date: "1905", composer: "Debussy"});

        // Schönberg
        taffy.insert({title: "Pierrot lunaire", date: "1912", composer: "Schönberg"});

        // Ravel
        taffy.insert({title: "Daphnis et Chloe", date: "1912", composer: "Ravel"});
        taffy.insert({title: "Ma mère l'Oye", date: "1910", composer: "Ravel"});
        taffy.insert({title: "Valses nobles et sentimentales", date: "1911", composer: "Ravel"});
        taffy.insert({title: "Histoires naturelles", date: "1906", composer: "Ravel"});
        taffy.insert({title: "Gaspard de la nuit", date: "1908", composer: "Ravel"});
        taffy.insert({title: "Rhapsodie espagnole", date: "1908", composer: "Ravel"});
        taffy.insert({title: "Trois poèmes de Mallarmés", date: "1913", composer: "Ravel"});

        // Stravinsky
        taffy.insert({title: "L'oiseau de feu", date: "1910", composer: "Stravinsky"});
        taffy.insert({title: "Le Sacre du Printemps", date: "1913", composer: "Stravinsky"});
        taffy.insert({title: "Petrouchka", date: "1911", composer: "Stravinsky"});
        taffy.insert({title: "Renard", date: "1916", composer: "Stravinsky"});
        taffy.insert({title: "Le Rossignol", date: "1914", composer: "Stravinsky"});
        taffy.insert({title: "Le Chant du Rossignol", date: "1917", composer: "Stravinsky"});
        taffy.insert({title: "L'Histoire du Soldat", date: "1917", composer: "Stravinsky"});
        return taffy;
    }
}

