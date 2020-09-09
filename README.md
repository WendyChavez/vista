
# Control de aforo

## RUN
> npm i

> npm run dev

## MODELS

### Registros

```
{
   email:  string, obligatorio
   pass:   string, obligatorio
   token:  string, autogenerado, JWT
   date:   Date, actual
   active: boolean, true
}
```
### Usuarios

```
{
   user:           string, obligatorio
   pass:           string, obligatorio
   token:          string, '', JWT
   id_counter:     string, autogenerado, 16 caracteres
   val_counter:    number : 0
   token_counter:  string, '', JWT
   name_counter:   string, 'Contador'
   id_counter_ext: string, ''
   suscritos:      []
   active: boolean, true
}
```
### Recuperar

```
{
   email:  string, obligatorio
   token:  string, autogenerado, JWT
   date:   Date, actual
   active: boolean, true
}
```

## API

### REGISTRAR
> **POST** http://52.203.1.191:3001/api/registrar

**Request**
```
{
   "email": EMAIL,
   "pass": PASS
}
```
**Response**
```
{
   "status": STATUS,
   "message": MENSAJE
}
```
**Algorithm**
1. Obtener usuarios.email = email
2. Si |usuarios| = 1 entonces
   1. Regresar {false, "El correo ya está registrado."}
3. Si no, si |usuarios| = 0 entonces
   1. Obtener registros.email = email
   2. Si |registros| > 100 entonces
      1. LOG {ATAQUE: Registros EMAIL}}
      2. Regresar {false, "Alcanzo el límite de intentos de registrarse."}
   3. Si no,
      1. Registros.active ← false
      2. Agregar registro {email,pass}
      3. Mandar correo {token}
      4. Regresar {true, "Se le ha enviado un correo."}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con el mail EMAIL}
   2. Regresar {false, "Error en el registro, por favor contacte a soporte."}

### CONFIRMAR REGISTRO
> **GET** http://52.203.1.191:3001/api/confirmarregistro/{email,token}

**Request**
```
{}
```
**Response**
```
HTML
```
**Algorithm**
1. Si existe un registro con email,token,activo entonces
   1. Obtener usuarios.email = email
   2. Si |usuarios| = 1 entonces
      1. Regresar HTML, "El usuario ya existe."
   3. Si no, si |usuarios| = 0 entonces
      1. Crear un usuario {email,pass}
      2. usuario.suscritos ← email
      3. Registro.active ← false
      4. Regresar HTML "Correo confirmado, ya puede usar su cuenta."
   4. Si no,
      1. LOG {INCINSISTENCIA: Hay más de un usuario con el mail EMAIL}
      2. Regresar HTML, "Error en la confirmación, por favor contacte a soporte."
2.  Si no,
    1.  LOG {ATAQUE: "URL inválida EMAIL TOKEN"}
    2.  Regresar HTML "URL inválida."

### LOGIN
> **PUT** http://52.203.1.191:3001/api/auth

**Request**
```
{
   "user": USER,
   "pass": PASS
}
```
**Response**
```
{
   "status": STATUS,
   "message": MENSAJE,
   "token": TOKEN
}
```
**Algorithm**
1. Obtener usuarios.email = email, usuarios.pass = pass, usuarios.active = true
2. Si |usuarios| = 0 entonces
   1. Regresar {false, "Usuario y/o contraseña incorrectos."}
3. Si no, si |usuarios| = 1 entonces
   1. usuario.token ← TOKEN
   2. Regresar {true, "", TOKEN}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con EMAIL PASS}
   2. Regresar {false, "Error en el login, por favor contacte a soporte."}

### RECUPERAR CONTRASEÑA
> **POST** http://52.203.1.191:3001/api/recuperar

**Request**
```
{
   "email": EMAIL
}
```
**Response**
```
{
   "status": STATUS,
   "message": MENSAJE
}
```
**Algorithm**
1. Obtener usuarios.email = email usuarios.active = true
2. Si |usuarios| = 0 entonces
   1. Regresar {false, "Usuario no registrado."}
3. Si no, si |usuarios| = 1 entonces
   1. Obtener recuperar.email = email
   2. Si, |recuperar| > 100 entonces
      1. Regresar {false, "Alcanzo el límite de intentos para recuperar su contraseña.Por favor contacte a soporte."}
   3. Si no,
      1. recuperar.active ← false
      2. Crear un recuperar {email}
      3. Mandar correo {email,token}
      4. Regresar {true, "Se le ha enviado un correo para restablecer su contraseña."}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con EMAIL PASS}
   2. Regresar {false, "Error en el login, por favor contacte a soporte"}

### CONFIRMAR RECUPERAR
> **GET** http://52.203.1.191:3001/api/confirmarrecuperar/{email,token}

**Request**
```
{}
```
**Response**
```
HTML
```
**Algorithm**
1. Si existe un recuperar con email,token,activo entonces
   1. Obtener usuarios.email = email
   2. Si |usuarios| = 0 entonces
      1. Regresar HTML, "El usuario no existe."
   3. Si no, si |usuarios| = 1 entonces
      1. usurio.pass ← PASS
      3. Regresar HTML "Se ha restablecido su contraseña (PASS)."
   4. Si no,
      1. LOG {INCINSISTENCIA: Hay más de un usuario con el mail EMAIL}
      2. Regresar HTML, "Error al restablecer la contraseña, por favor contacte a soporte."
2.  Si no,
    1.  LOG {ATAQUE: "URL inválida EMAIL TOKEN"}
    2.  Regresar HTML "URL inválida."

### CAMBIAR CONTRASEÑA
> **PUT** http://52.203.1.191:3001/api/cambiarcontrasena

**Request**
```
{
   "user": USER,
   "pass": PASS,
   "token : TOKEN"
}
```
**Response**
```
{
   "status": STATUS,
   "message": MENSAJE
}
```
**Algorithm**
1. Obtener usuarios con user,token,activo
2. Si |usuarios| = 0 entonces
   1. LOG {ATAQUE: "No autorizado EMAIL TOKEN"}
   2. Regresar {false, "Error en las credenciales."}
3. Si no, si |usuarios| = 1 entonces
   1. usurio.pass ← PASS
   2. Regresar {true, "Se ha restablecido su contraseña."}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con EMAIL}
   2. Regresar {false, "Error al restablecer su contraseña, por favor contacte a soporte"}

### CONTAR
> **PUT** http://52.203.1.191:3001/api/contar

**Request**
```
{
   "user": USER,
   "token": TOKEN,
   "type": TYPE
}
```
**Response**
```
{
   "status": STATUS,
   "message": MENSAJE
}
```
**Algorithm**
1. Obtener usuarios con user,token,activo
2. Si |usuarios| = 0 entonces
   1. LOG {ATAQUE: "No autorizado EMAIL TOKEN"}
   2. Regresar {false, "Error en las credenciales."}
3. Si no, si |usuarios| = 1 entonces
   1. Si user.id_counter_ext ≠ "" entonces
      1. Obtener usuario.id_counter = id_counter_ext
   2. Si user ϵ usuario.suscritos
      1. Caso type = 1
         1. user.val_counter++
         2. Regresar {true,""}
      2. Caso tupe = -1
         1. user.val_counter--
         2. Regresar {true,""}
      3. Otro caso
         1. Regresar {false,"Error al modificar el contador."}
   3. Si no,
      1. Regresar {false,"No tiene permisos para modificar este contador."}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con EMAIL}
   2. Regresar {false, "Error al restablecer su contraseña, por favor contacte a soporte"}

### OBTENER DISPLAY
> **GET** http://52.203.1.191:3001/api/contar

**Request**
```
{
   "user": USER,
   "token": TOKEN
}
```
**Response**
```
{
   "status": STATUS,
   "message": MENSAJE
}
```
**Algorithm**
1. Obtener usuarios con user,token,activo
2. Si |usuarios| = 0 entonces
   1. LOG {ATAQUE: "No autorizado EMAIL TOKEN"}
   2. Regresar {false, "Error en las credenciales."}
3. Si no, si |usuarios| = 1 entonces
   1. Si user.id_counter_ext ≠ "" entonces
      1. Obtener usuario.id_counter = id_counter_ext
   2. Si user ϵ usuario.suscritos
      1. Regresar {true,"user.val_counter"}
   3. Otro caso
      1. Regresar {false,"Error al modificar el contador."}
   4. Si no,
      1. Regresar {false,"No tiene permisos para leer este contador."}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con EMAIL}
   2. Regresar {false, "Error al restablecer su contraseña, por favor contacte a soporte"}

### CAMBIAR NOMBRE
> **GET** http://52.203.1.191:3001/api/renombrar

**Request**
```
{
   "user": USER,
   "token": TOKEN,
   "name": NAME
}
```
**Response**
```
{
   "status": STATUS,
   "message": MENSAJE
}
```
**Algorithm**
1. Obtener usuarios con user,token,activo
2. Si |usuarios| = 0 entonces
   1. LOG {ATAQUE: "No autorizado EMAIL TOKEN"}
   2. Regresar {false, "Error en las credenciales."}
3. Si no, si |usuarios| = 1 entonces
   1. Si user.id_counter_ext = "" entonces
      1. user.name_counter ← name
      2. Regresar {true,""}
   2. Si no,
      1. Regresar {false, "No se puede renombrar los contadores externos"}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con EMAIL}
   2. Regresar {false, "Error al restablecer su contraseña, por favor contacte a soporte"}

### CONECTAR
> **PUT** http://52.203.1.191:3001/api/conectar

**Request**
```
{
   "user" : USER,
   "token": TOKEN,
   "id_counter": ID_COUNTER,
   "token_counter": TOKEN_COUNTER,
   "type": TYPE
}
```
**Response**
```
{
	"status": STATUS,
	"message": MENSAJE
}
```
**Algorithm**
1. Obtener usuarios con user,token,activo
2. Si |usuarios| = 0 entonces
   1. LOG {ATAQUE: "No autorizado EMAIL TOKEN"}
   2. Regresar {false, "Error en las credenciales."}
3. Si no, si |usuarios| = 1 entonces
   1. Obtener usuario_ext id_counter,token_counter,active
   2. Si |usuario_ext| = 1
      1. usuario_ext.suscritos ← email
      2. Obtener usuarios user ϵ suscritos
      3. usuarios.suscritos - user
      4. usuario.id_counter_ext ← id_counter
      5. Regresar {true,"Contador agregado con éxito"}
   3. Si no,
      1. Regresar {false,"El contador no existe"}
4. Si no,
   1. LOG {INCINSISTENCIA: Hay más de un usuario con EMAIL}
   2. Regresar {false, "Error al restablecer su contraseña, por favor contacte a soporte"}

