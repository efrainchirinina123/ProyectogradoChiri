'use strict';
const { Model, DataTypes, Op } = require('sequelize');
const cron = require('node-cron'); // Importa node-cron para programar tareas

module.exports = (sequelize) => {
    class HistoriaVentas extends Model {
        static associate(models) {
            HistoriaVentas.belongsTo(models.Productos, {
                foreignKey: 'productos_id',
                as: 'producto',
            });
        }

        fromDataModel() {
            return {
                id: this.id,
                productos_id: this.productos_id,
                total: this.total,
                metodopago: this.metodopago,
                nombre: this.nombre,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            };
        }

        // Método estático para verificar y registrar ventas
        static async registrarVentasAutomaticas() {
            try {
                // Fecha actual y hace tres días
                const fechaActual = new Date();
                const haceTresDias = new Date();
                haceTresDias.setDate(fechaActual.getDate() - 3);

                // Buscar ventas de los últimos 3 días
                const ventas = await HistoriaVentas.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [haceTresDias, fechaActual],
                        },
                    },
                });

                if (ventas.length > 0) {
                    console.log(`Se han registrado ${ventas.length} ventas en los últimos 3 días.`);
                    // Aquí podrías agregar lógica adicional para agrupar las ventas
                    // y registrar en una tabla de resumen si es necesario
                } else {
                    console.log('No se han registrado ventas en los últimos 3 días.');
                }
            } catch (error) {
                console.error('Error al registrar ventas:', error);
            }
        }
    }

    HistoriaVentas.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        productos_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'productos',
                key: 'id',
            },
        },
        total: {
            type: DataTypes.DECIMAL(10, 2), // Cambiado a DECIMAL para valores monetarios
            allowNull: false,
        },
        metodopago: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Asignar valor predeterminado a la fecha de creación
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Asignar valor predeterminado a la fecha de actualización
        }
    }, {
        sequelize,
        modelName: 'HistoriaVentas',
        tableName: 'historia_ventas',
        timestamps: true, // Manejo automático de createdAt y updatedAt
    });

    // Programar la tarea para que se ejecute cada 3 días
    cron.schedule('0 0 */3 * *', async () => {
        console.log('Ejecutando tarea de registro de ventas automáticas cada 3 días');
        await HistoriaVentas.registrarVentasAutomaticas();
    });

    return HistoriaVentas;
};
