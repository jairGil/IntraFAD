# Ruta de la carpeta de cada servidor de Express
$server1 = "D:\Documentos\SevicioSocial\Proyectos\IntraFAD\Microservicios\archivos"
$server2 = "D:\Documentos\SevicioSocial\Proyectos\IntraFAD\Microservicios\datosPersonales"
$server3 = "D:\Documentos\SevicioSocial\Proyectos\IntraFAD\Microservicios\FT_Docente"
$server4 = "D:\Documentos\SevicioSocial\Proyectos\IntraFAD\Interfaz"

$command = "npm run dev"

# Abrir ventana 1 y ejecutar servidor de Express en la carpeta del servidor 1
Start-Process powershell.exe -WorkingDirectory $server1 -ArgumentList "-Command", $command

# Abrir ventana 2 y ejecutar servidor de Express en la carpeta del servidor 2
Start-Process powershell.exe -WorkingDirectory $server2 -ArgumentList "-Command", $command

# Abrir ventana 3 y ejecutar servidor de Express en la carpeta del servidor 3
Start-Process powershell.exe -WorkingDirectory $server3 -ArgumentList "-Command", $command

# Abrir ventana 3 y ejecutar servidor de Express en la carpeta del servidor 4
Start-Process powershell.exe -WorkingDirectory $server4 -ArgumentList "-Command", $command
