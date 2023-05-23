# Ruta de la carpeta de cada servidor de Express
$server1 = "./Microservicios/archivos"
$server2 = "./Microservicios/datosPersonales"
$server3 = "./Microservicios/FT_Docente"
$server4 = "./Interfaz"

$command = "npm run dev"

# Abrir ventana 1 y ejecutar servidor de Express en la carpeta del servidor 1
Start-Process powershell.exe -WorkingDirectory $server1 -ArgumentList "-Command", $command

# Abrir ventana 2 y ejecutar servidor de Express en la carpeta del servidor 2
Start-Process powershell.exe -WorkingDirectory $server2 -ArgumentList "-Command", $command

# Abrir ventana 3 y ejecutar servidor de Express en la carpeta del servidor 3
Start-Process powershell.exe -WorkingDirectory $server3 -ArgumentList "-Command", $command

# Abrir ventana 3 y ejecutar servidor de Express en la carpeta del servidor 4
Start-Process powershell.exe -WorkingDirectory $server4 -ArgumentList "-Command", $command
