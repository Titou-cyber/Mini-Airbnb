const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

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