const jwt = require("jsonwebtoken");
const { Module, RolModule } = require("../models/index");

// * middleware para verificar el token introducido
const validarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "No tiene autorizacion, envie un token",
        });
    }

    try {
        const token = authHeader.split(" ")[1]; // Separa el esquema 'Bearer' del token
        const userToken = jwt.verify(token, process.env.SECRET_KEY);

        if (userToken) {
            // * Guardamos el rol en la request
            req.rol = userToken.rol; // Asegúrate de que 'rol' esté en el payload del token
            next();
        }
    } catch (error) {
        console.error(error); // Imprime el error en la consola para depuración
        res.status(400).json({ message: "Token no válido" });
    }
};

// * middleware para verificar los permisos del usuario
const validarPermisos = async (req, res, next) => {
    // * Verificamos si se pasó antes por el middleware de verificación del token y recuperamos el rol
    if (!req.rol) {
        return res.status(500).json({ message: "Token no validado" });
    }

    const idRol = req.rol;

    // * Verificamos si la url existe en nuestra base de datos
    const urlModule = await Module.findOne({ where: { url: req.baseUrl } });

    if (!urlModule) {
        return res.status(404).json({
            message: "Esta Module y ruta no existe en la base de datos",
        });
    }

    const idModule = urlModule.id;

    // * Verificamos si el rol tiene los permisos de acceder a dicho Module
    const usuarioPermitido = await RolModule.findOne({
        where: {
            idModule,
            idRol,
        },
    });

    if (usuarioPermitido) {
        switch (req.method) {
            case "GET":
                if (usuarioPermitido.okSelect) return next();
                return res.status(401).json({
                    message: "No tiene permisos para realizar esta accion SELECT",
                });
            case "POST":
                if (usuarioPermitido.okInsert) return next();
                return res.status(401).json({
                    message: "No tiene permisos para realizar esta accion CREATE",
                });
            case "PUT":
                if (usuarioPermitido.okUpdate) return next();
                return res.status(401).json({
                    message: "No tiene permisos para realizar esta accion UPDATE",
                });
            case "DELETE":
                if (usuarioPermitido.okDelete) return next();
                return res.status(401).json({
                    message: "No tiene permisos para realizar esta accion DELETE",
                });
            case "PATCH":
                if (usuarioPermitido.okUpdate) return next();
                return res.status(401).json({
                    message: "No tiene permisos para realizar esta accion UPDATE",
                });
            default:
                return res.status(405).json({ message: "Método no permitido" });
        }
    } else {
        return res.status(403).json({
            message: "El usuario no tiene permisos",
        });
    }
};

module.exports = {
    validarToken,
    validarPermisos,
};
