<script setup>
import { ref, computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);
const router = useRouter();
const errorMessage = ref('');

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo' : 'logo'}.png`;
});

const handleLogin = () => {
    // Verificar que ambos campos estén llenos antes de redirigir
    if (!email.value || !password.value) {
        
        window.location.href = '/auth/error'; // Redirecciona a /auth/error
        return;
    }
};

</script>

<template>
    <div class="container">
        <div class="login-wrapper">
            <div class="form-section">
                <div class="card">
                    <div class="card-header">
                        <img src="https://smart-tk.com/wp-content/uploads/2021/12/Ecommerce-Carrito_.png" alt="Avatar" class="avatar" />
                        <h2>Bienvenido a ShopChiri</h2>
                        <p>Inicia sesión para continuar</p>
                    </div>
                    <form @submit.prevent="handleLogin">
                        <div class="form-group">
                            <InputText id="email1" type="text" class="input-field" v-model="email" />
                            <label for="email1">Usuario</label>
                        </div>
                        <div class="form-group">
                            <Password id="password1" v-model="password" :toggleMask="true" class="input-field" inputClass="input-style" :inputStyle="{ padding: '1rem' }" />
                            <label for="password1">Contraseña</label>
                        </div>
                        <div class="remember-me">
                            <!-- <Checkbox v-model="checked" id="rememberme" binary class="checkbox" />
                            <label for="rememberme1">Recordarme</label> -->
                            <a class="forgot-password">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
                        <div class="button-container">
                            <button type="submit" class="login-button" onclick="window.location.href='/Dashboard'">
                                Iniciar Sesión
                            </button>
                        </div>
                        
                    </form>
                </div>
            </div>
            <div class="logo-section">
                <!-- <img :src="logoUrl" alt="Logo" class="logo" /> -->
            </div>
        </div>
    </div>
</template>
<style scoped>

/* Contenedor principal */
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: radial-gradient(circle, #3120c9, #dfe1e4);
    padding: 0 20px;
}

/* Wrapper del login */
.login-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 500px;
    gap: 20px;
    animation: slideIn 0.8s ease-out;
}

/* Sección del formulario */
.form-section {
    width: 100%;
}

/* Card */
.card {
    
    border-radius: 24px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.8s ease-out;
}

/* Header del Card */
.card-header {
    text-align: center;
    margin-bottom: 20px;
}

/* Avatar */
.avatar {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    border: 4px solid #1abc9c;
    animation: bounceIn 1s ease-out;
}

/* Títulos */
h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c3e50;
    font-weight: 600;
    letter-spacing: 1px;
}

p {
    color: #000000;
}

/* Inputs */
.form-group {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
}

.input-field {
    width: 100%;
    border: 2px solid #ddd;
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 5px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.input-field:focus {
    border-color: #030303;
    box-shadow: 0 0 12px rgba(26, 188, 156, 0.3);
    outline: none;
    transform: scale(1.02);
}

label {
    position: absolute;
    top: 12px;
    left: 16px;
    font-size: 14px;
    color: #7f8c8d;
    transition: all 0.3s ease;
}

.input-field:focus + label {
    top: -20px;
    left: 12px;
    font-size: 12px;
    color: #1abc9c;
}

/* Checkbox y enlaces */
.remember-me {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
}

.checkbox {
    margin-right: 10px;
}

.forgot-password {
    color: #1abc9c;
    text-decoration: none;
    transition: color 0.3s ease;
}

.forgot-password:hover {
    color: #16a085;
}

/* Mensajes de error */
.error-message {
    color: #e74c3c;
    margin-bottom: 20px;
}

/* Contenedor del botón */
.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

/* Botón */
.login-button {
    padding: 14px 28px;
    background: linear-gradient(135deg, #1abc9c, #16a085);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}

.login-button:hover {
    background: linear-gradient(135deg, #16a085, #1abc9c);
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.login-button:focus {
    outline: none;
}

/* Sección del logo */
.logo-section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.logo {
    width: 200px;
    height: auto;
    animation: pulse 1.5s infinite;
}

/* Animaciones */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes bounceIn {
    from { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.15); }
    to { transform: scale(1); opacity: 1; }
}

@keyframes glow {
    0% { box-shadow: 0 0 8px rgba(26, 188, 156, 0.3); }
    50% { box-shadow: 0 0 20px rgba(26, 188, 156, 0.5); }
    100% { box-shadow: 0 0 8px rgba(26, 188, 156, 0.3); }
}

@keyframes slideIn {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.9; }
    100% { transform: scale(1); opacity: 1; }
}
</style>
