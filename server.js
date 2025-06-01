// Importation des modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Ajout du module multer

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image.'));
    }
  }
});

// Création de l'application Express
const app = express();
const PORT = 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour analyser les données des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Création du dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, 'public/images/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Base de données simple (tableau d'objets JavaScript)
let logements = [
  {
    id: 1,
    titre: "Appartement lumineux au centre-ville",
    description: "Bel appartement de 50m² avec balcon, idéalement situé au centre-ville. À proximité des commerces et des transports en commun.",
    prix: 75,
    image: "appartement1.jpg",
    chambres: 1,
    salleDeBains: 1,
    capacite: 2,
    equipements: ["WiFi", "Cuisine équipée", "Machine à laver", "TV"]
  },
  {
    id: 2,
    titre: "Villa avec piscine",
    description: "Magnifique villa de 150m² avec piscine privée et jardin. Parfaite pour des vacances en famille ou entre amis.",
    prix: 180,
    image: "villa1.jpg",
    chambres: 3,
    salleDeBains: 2,
    capacite: 6,
    equipements: ["WiFi", "Piscine", "Parking", "Barbecue", "Climatisation"]
  },
  {
    id: 3,
    titre: "Studio cosy proche de la plage",
    description: "Charmant studio de 30m² à seulement 5 minutes à pied de la plage. Idéal pour un couple ou une personne seule.",
    prix: 60,
    image: "studio1.jpg",
    chambres: 0,
    salleDeBains: 1,
    capacite: 2,
    equipements: ["WiFi", "Kitchenette", "TV"]
  },
  {
    id: 4,
    titre: "Chalet en montagne",
    description: "Authentique chalet en bois au cœur des montagnes. Vue imprenable et calme absolu garanti.",
    prix: 120,
    image: "chalet1.jpg",
    chambres: 2,
    salleDeBains: 1,
    capacite: 4,
    equipements: ["WiFi", "Cheminée", "Terrasse", "Parking"]
  }
];

// Liste des équipements disponibles
const equipementsDisponibles = [
  "WiFi", "Cuisine équipée", "Machine à laver", "TV", "Piscine", 
  "Parking", "Barbecue", "Climatisation", "Cheminée", "Terrasse", 
  "Vue sur mer", "Jacuzzi", "Jardin", "Balcon", "Ascenseur", 
  "Sèche-linge", "Accès handicapé", "Animaux acceptés"
];

// Routes
// Page d'accueil
app.get('/', (req, res) => {
  res.render('accueil', { 
    logements: logements,
    title: 'Mini-Airbnb - Accueil' 
  });
});

// Page de détail d'un logement
app.get('/logement/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const logement = logements.find(log => log.id === id);
  
  res.render('detail', { 
    logement: logement,
    title: `Mini-Airbnb - ${logement.titre}` 
  });
});

// Page d'ajout d'annonce
app.get('/ajouter-annonce', (req, res) => {
  res.render('ajouter-annonce', {
    title: 'Mini-Airbnb - Ajouter une annonce',
    equipementsDisponibles: equipementsDisponibles
  });
});

// Traitement du formulaire d'ajout d'annonce avec upload de fichier
app.post('/ajouter-annonce', upload.single('image'), (req, res) => {
  try {
    console.log("Contenu de req.body:", req.body);
    console.log("Fichier uploadé:", req.file);
    
    const { titre, description, prix, chambres, salleDeBains, capacite } = req.body;

    // Vérification des champs obligatoires
    if (!titre || titre.trim() === '') {
      return res.status(400).send("Le champ 'titre' est manquant ou invalide.");
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).send("Le champ 'description' est manquant ou invalide.");
    }
    
    if (!prix || isNaN(parseInt(prix))) {
      return res.status(400).send("Le champ 'prix' est manquant ou invalide.");
    }
    
    // Récupération des équipements (sous forme de tableau)
    let equipements = req.body.equipements;
    if (!Array.isArray(equipements)) {
      equipements = equipements ? [equipements] : [];
    }
    
    // Création d'un nouvel ID
    const newId = logements.length > 0 ? Math.max(...logements.map(l => l.id)) + 1 : 1;
    
    // Attribution d'une image
    let image = "default.jpg";
    
    // Si un fichier a été uploadé, utiliser son nom
    if (req.file) {
      image = 'uploads/' + req.file.filename;
    } else {
      // Attribution d'une image par défaut selon le type de logement
      const titreEnMinuscules = titre.toLowerCase();
      
      if (titreEnMinuscules.includes("appartement") || titreEnMinuscules.includes("studio")) {
        image = "appartement1.jpg";
      } else if (titreEnMinuscules.includes("villa") || titreEnMinuscules.includes("maison")) {
        image = "villa1.jpg";
      } else if (titreEnMinuscules.includes("chalet") || titreEnMinuscules.includes("montagne")) {
        image = "chalet1.jpg";
      } else if (titreEnMinuscules.includes("plage") || titreEnMinuscules.includes("mer")) {
        image = "studio1.jpg";
      }
    }
    
    // Création du nouvel objet logement
    const nouveauLogement = {
      id: newId,
      titre,
      description,
      prix: parseInt(prix),
      image,
      chambres: parseInt(chambres) || 0,
      salleDeBains: parseInt(salleDeBains) || 1,
      capacite: parseInt(capacite) || 1,
      equipements
    };
    
    logements.push(nouveauLogement);
    
    // Redirection vers la page d'accueil
    res.redirect('/');
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une annonce:", error);
    res.status(500).send("Une erreur est survenue lors de l'ajout de l'annonce: " + error.message);
  }
});

// Page À propos
app.get('/a-propos', (req, res) => {
  res.render('a-propos', {
    title: 'Mini-Airbnb - À propos'
  });
});

// Page Contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Mini-Airbnb - Contact'
  });
});

// Traitement du formulaire de contact
app.post('/contact', (req, res) => {
  try {
    const { nom, email, message } = req.body;
    
    // Validation des champs requis
    if (!nom || !email || !message) {
      return res.status(400).send("Tous les champs sont obligatoires.");
    }
    
    console.log(`Nouveau message de ${nom} (${email}): ${message}`);
    
    res.render('contact-confirmation', {
      title: 'Mini-Airbnb - Message envoyé'
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    res.status(500).send("Une erreur est survenue lors de l'envoi du message.");
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});