#!/bin/bash

# Lancer nodemon pour le back-end
xterm -e 'bash -c "npx nodemon back/index.js; exec bash"' &

# Lancer nodemon pour le front-end
xterm -e 'bash -c "npx nodemon front/index.js; exec bash"' &
