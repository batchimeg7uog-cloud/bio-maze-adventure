// COLLECTABLE VISUAL AUDIT ONLY.
// Improves biology-object pictograms across grades 6–11 without changing names,
// descriptions, answers, scoring, lives, maze, progression, movement or save/resume.
(() => {
    const C = window.__B5C;
    if (!C) return;

    const visual = {
        // Organization levels / general biology
        cell: '🔬', tissue: '🧫', organ: '🫀', organism: '🧍',
        population: '👥', community: '🌿', ecosystem: '🌎', biosphere: '🌍',

        // Taxonomy: make each rank visually distinct instead of one generic ecosystem sphere.
        species: '🧬', genus: '📚', family: '🗂️', order: '📂', class: '🗃️', kingdom: '👑',

        // Major organism groups
        plant: '🌿', mammal: '🐕', fungus: '🍄', bacteria: '🦠',
        fish: '🐟', bird: '🐦', amphibian: '🐸', reptile: '🦎', insect: '🦋', arachnid: '🕷️',

        // Life processes
        nutrition: '🍽️', respiration: '🌬️', growth: '🌱', movement: '🏃',
        sensitivity: '👁️', excretion: '🚰', reproduction: '🌼',

        // Digestive / respiratory / circulatory / excretory
        mouth: '👄', stomach: '🫃', intestine: '➰', large_intestine: '➿',
        lungs: '🫁', trachea: '🫁', bronchus: '🌿', bronchiole: '🌱', alveoli: '🫧', diaphragm: '↕️',
        heart: '❤️', artery: '🔴', vein: '🔵', capillary: '🩸', blood: '🩸', plasma: '🟨', rbc: '🔴', hemoglobin: '🩸',
        kidney: '🫘', ureter: '〰️', bladder: '💧', nose: '👃',

        // Plant reproduction / development
        flower: '🌸', pollen: '🟡', pollination: '🐝', fertilization: '✨', seed: '🌰', fruit: '🍎', germination: '🌱',
        gamete: '🧬', sperm: '🔹', egg: '🥚', zygote: '🔵', embryo: '👶', adult: '🧑',

        // Cell division / genetics
        mitosis: '🧫', meiosis: '🧬', dna: '🧬', gene: '🧬', chromosome: '✖️', nucleotide: '🔹',
        interphase: '⏳', prophase: '🧬', metaphase: '↔️', anaphase: '↔️', telophase: '⭕',
        genetic_diversity: '🧬', species_diversity: '🐾', ecosystem_diversity: '🌎', variation: '🔀', mutation: '⚡',

        // Biomolecules / enzymes / protein synthesis
        glucose: '🍬', starch: '🌾', glycogen: '🟤', protein: '🥩', aminoacid: '🔹', peptide: '🔗',
        lipid: '🧈', glycerol: '💧', fattyacid: '〰️', enzyme: '⚙️', substrate: '🧩', active_site: '🎯',
        temperature: '🌡️', ph: '🧪', denaturation: '🔥', mrna: '📨', trna: '🚚', ribosome: '🏭', codon: '🔤',
        transcription: '✍️', translation: '🏭',

        // Plant transport
        xylem: '🟦', phloem: '🟩', stomata: '🍃', root_hair: '🌱', transpiration: '💨',
        osmosis: '💧', mineral: '🧂', sucrose: '🍬', translocation: '↔️',

        // Ecology / environment
        producer: '🌱', consumer: '🐇', decomposer: '🍄', food_chain: '🔗', food_web: '🕸️',
        habitat: '🏞️', shelter: '🏠', pollution: '🏭', biomass: '📊', trophic: '🔺',
        air: '💨', rock: '🪨', plastic: '🧴', clock: '🕒'
    };

    Object.entries(visual).forEach(([key, emoji]) => {
        const row = C[key];
        if (!Array.isArray(row)) return;
        // Force the existing renderer to use its emoji fallback for these audited items.
        // This prevents misleading reused schematics (e.g. amphibian as fish, lipid as protein,
        // taxonomy ranks as identical ecosystem spheres) while leaving all content untouched.
        row[0] = `visual_${key}`;
        row[1] = emoji;
    });
})();
