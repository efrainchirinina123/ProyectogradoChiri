<template>
    <div>
      <button 
        :class="{ active: isActive }" 
        @click="toggleActive"
      >
    
      </button>
    </div>
  </template>
 
  
  <style>
  .active {
    background-color: blue;
    color: white;
  }
  </style>
  