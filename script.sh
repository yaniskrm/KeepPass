#!/bin/bash

# Fonction pour lancer nodemon pour le back-end
launch_backend() {
  if [ "$(uname)" == "Darwin" ]; then
    # Pour macOS
    osascript -e 'tell app "Terminal" to do script "npx nodemon back/index.js"'
  else
    # Pour Linux
    xterm -e 'bash -c "npx nodemon back/index.js; exec bash"' &
  fi
}

# Fonction pour lancer nodemon pour le front-end
launch_frontend() {
  if [ "$(uname)" == "Darwin" ]; then
    # Pour macOS
    osascript -e 'tell app "Terminal" to do script "npx nodemon front/index.js"'
  else
    # Pour Linux
    xterm -e 'bash -c "npx nodemon front/index.js; exec bash"' &
  fi
}

# Exécuter les fonctions en arrière-plan
launch_backend &
launch_frontend &
