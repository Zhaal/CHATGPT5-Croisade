// Fichier de configuration pour la génération de la galaxie.
// L'utilisateur peut modifier les valeurs ci-dessous pour personnaliser la carte.

window.galaxyConfig = {
    // Taille de la galaxie (nombre de systèmes par côté). Par défaut : 9
    size: 9,

    // Poids pour la génération des types de planètes.
    // Des poids plus élevés signifient des chances d'apparition plus grandes.
    planetTypes: [
        { name: "Monde Ruche", weight: 38 },
        { name: "Agri-monde", weight: 25 },
        { name: "Monde Sauvage", weight: 15 },
        { name: "Monde Mort", weight: 10 },
        { name: "Monde Forge", weight: 10 },
        { name: "Monde Saint (relique)", weight: 2 }
    ]
};
