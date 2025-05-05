const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const logements = [
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

app.get('/', (req, res) => {
    res.render('accueil', { 
      logements: logements,
      title: 'Mini-Airbnb - Accueil' 
    });
});

app.get('/logement/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const logement = logements.find(log => log.id === id);
    
    if (!logement) {
      return res.status(404).render('404', { 
        title: 'Logement non trouvé' 
      });
    }
    
    res.render('detail', { 
      logement: logement,
      title: `Mini-Airbnb - ${logement.titre}` 
    });
});

app.listen(PORT, () => {
    console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});