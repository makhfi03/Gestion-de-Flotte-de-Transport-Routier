const calculerDistance = (kmDepart, kmArrivee) => {
    const depart = Number(kmDepart) || 0;
    const arrivee = Number(kmArrivee) || 0;

    if (arrivee < depart) {
        const error = new Error(`Le kilométrage d'arrivée (${arrivee} km) ne peut pas être inférieur au kilométrage de départ (${depart} km).`);
        error.statusCode = 400;
        throw error;
    }

    return arrivee - depart;
};

const calculerConsommationAux100Km = (volumeGasoil, distanceKm) => {
    const volume = Number(volumeGasoil) || 0;
    const distance = Number(distanceKm) || 0;

    if (distance <= 0) {
        return 0;
    }

    return Number(((volume * 100) / distance).toFixed(2));
};

const calculerMetriquesTrajet = (kmDepart, kmArrivee, volumeGasoil) => {
    const distanceKm = calculerDistance(kmDepart, kmArrivee);
    const consommationMoyenne = calculerConsommationAux100Km(volumeGasoil, distanceKm);

    return {
        distanceKm,
        consommationMoyenne
    };
};

module.exports = {
    calculerDistance,
    calculerConsommationAux100Km,
    calculerMetriquesTrajet
};
