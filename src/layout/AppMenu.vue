<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    label: 'Inicio de Sesion',
    icon: 'pi pi-fw pi-user',
    items: [
      {
    label: 'Seguridad',
    icon: 'pi pi-fw pi-shield', // Cambiado a 'login' sin el prefijo 'mdi-'
    items: [  // Aquí se añaden elementos adicionales dentro de Login
        {
            label: 'Login',
            icon: 'pi pi-fw pi-key',
            to: '/auth/login',
        },
        {
            label: 'Error',
            icon: 'pi pi-fw pi-exclamation-triangle',
            to: '/auth/error'
        },
               {
            label: 'Acceso Denegado',
            icon: 'pi pi-fw pi-exclamation-circle',
            to: '/auth/access'
        }
            ]
        },

        
    ]
},
    { label: 'Inicio', items: [{ label: 'Panel', icon: 'pi pi-fw pi-box', to: '/Dashboard' }] },
    { label: 'Vista Admin' },
    { label: '', items: [{ label: 'Productos', icon: 'pi pi-fw pi-briefcase', to: '/productos' }] },
    { label: '', items: [{ label: 'Historia Ventas', icon: 'pi pi-fw pi-book', to: '/Historia_ventas' }] },
    { label: '', items: [{ label: 'Carritos', icon: 'pi pi-fw pi-shopping-cart', to: '/carritos' }] },
    { label: '', items: [{ label: 'Recibos', icon: 'pi pi-fw pi-file', to: '/recibos' }] },
    { label: '', items: [{ label: 'Pagos', icon: 'pi pi-fw pi-dollar', to: '/pagos' }] },
    { label: '', items: [{ label: 'Comentarios', icon: 'pi pi-fw pi-comments', to: '/comentarios' }] },
]);
</script>

<template>
    <ul class="layout-menu p-4 text-white shadow-lg rounded-lg space-y-4">
        <!-- Imagen en la parte superior del menú -->
        <!-- <li class="mb-4">
            <img
                src="https://img.freepik.com/vector-premium/fondo-azul-ilustracion-telefono-inteligente-banner-compras-linea_435359-217.jpg"
                alt="Logo"
                class="w-full mt-3 img-hover-glow-elevation"
            />
        </li> -->

        <transition-group name="slide-fade" tag="div">
            <template v-for="(item, i) in model" :key="item.label">
                <app-menu-item
                    v-if="!item.separator"
                    :item="item"
                    :index="i"
                    class="menu-item group relative p-3 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out"
                >
                    <ul
                        v-if="item.items"
                        class="sub-menu absolute left-0 top-full mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg"
                    >
                        <li
                            v-for="subItem in item.items"
                            :key="subItem.label"
                            class="p-2 hover:bg-blue-700 transition-colors duration-300 rounded-lg flex items-center"
                        >
                            <!-- Icono del sub-item con clase para cambiar color -->
                            <i :class="subItem.icon + ' submenu-icon'" />
                            <a :href="subItem.to || subItem.url" :target="subItem.target">{{ subItem.label }}</a>
                        </li>
                    </ul>
                </app-menu-item>
            </template>
        </transition-group>

        <!-- <li class="mt-6">
            <a href="https://www.primefaces.org/primeblocks-vue/#" target="_blank">
                <img
                    src="https://img.freepik.com/vector-premium/fondo-azul-ilustracion-telefono-inteligente-banner-compras-linea_435359-217.jpg"
                    alt="Prime Blocks"
                    class="w-full mt-3 img-hover-glow-elevation"
                />
            </a>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped>
/*<!-- @keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
} -->*/

@keyframes cursor-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0.4);
  }
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-submenu {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.layout-menu {
  border-radius: 10px;
  background-color: var(--surface-card);
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.menu-item {
  position: relative;
  padding: 1rem;
  cursor: pointer;
  border-radius: 1rem;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease, box-shadow 0.3s ease;
  animation: slide-in-left 0.5s ease-out;
}

.menu-item:hover {
  animation: cursor-pulse 1s ease-in-out infinite;
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.sub-menu {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
  background-size: 200% 200%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  transform: translateX(-20px);
  animation: slide-in-submenu 0.3s ease-out;
}

.menu-item:hover .sub-menu {
  opacity: 1;
  transform: translateX(0);
  animation: gradient-animation 8s ease infinite;
}

.sub-menu li {
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
}

.sub-menu li:hover {
  background-color: rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.sub-menu li a {
  text-decoration: none;
  color: #333;
  margin-left: 0.5rem;
}

.sub-menu li a:hover {
  text-decoration: underline;
}

.submenu-icon {
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s ease;
}

.sub-menu li:hover .submenu-icon {
  color: #1d4ed8; /* Cambia este color según tus preferencias */
}

@keyframes glow-elevation {
  0% {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    filter: brightness(1);
  }
  50% {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    filter: brightness(1.2);
  }
  100% {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    filter: brightness(1);
  }
}

.img-hover-glow-elevation {
  transition: transform 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease;
  border-radius: 1rem;
}

.img-hover-glow-elevation:hover {
  animation: glow-elevation 1s ease-in-out infinite;
}
</style>
