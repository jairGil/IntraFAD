#!/bin/bash

#########################################################
# Para ejecutar el script debe ejecutar el comando:     #
#           chmod +x start.sh                           #
#########################################################

ruta_archivos="./Microservicios/archivos"
ruta_datosPersonales="./Microservicios/datosPersonales"
ruta_fichaTecnica="./Microservicios/FT_Docente"
ruta_interfaz="./Interfaz"

gnome-terminal --tab --title="Archivos" --command="bash -c 'cd $ruta_archivos && npm run dev'"
gnome-terminal --tab --title="Datos Personales" --command="bash -c 'cd $ruta_datosPersonales && npm run dev'"
gnome-terminal --tab --title="Ficha Tecnica" --command="bash -c 'cd $ruta_fichaTecnica && npm run dev'"
gnome-terminal --tab --title="Interfaz" --command="bash -c 'cd $ruta_interfaz && npm run dev'"
