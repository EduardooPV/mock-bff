<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Mock BFF Configuration</h1>
      
      <!-- Configuration Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Error Simulation -->
        <div class="space-y-2">
          <div class="flex items-center">
            <label for="simulateError" class="font-medium text-gray-700 mr-2">Simulate Error</label>
            <div class="relative inline-block" @mouseenter="showErrorTooltip = true" @mouseleave="showErrorTooltip = false">
              <InfoIcon class="h-4 w-4 text-gray-400" />
              <div v-if="showErrorTooltip" class="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg -mt-2 ml-2">
                When enabled, the API will return a 500 error instead of the mock data
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <input 
              id="simulateError" 
              type="checkbox" 
              v-model="config.simulateError"
              class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label for="simulateError" class="ml-2 text-sm text-gray-600 cursor-pointer">
              {{ config.simulateError ? 'Error will be returned' : 'Normal response will be returned' }}
            </label>
          </div>
        </div>

        <!-- Response Delay -->
        <div class="space-y-2">
          <div class="flex items-center">
            <label for="responseDelay" class="font-medium text-gray-700 mr-2">Response Delay (seconds)</label>
            <div class="relative inline-block" @mouseenter="showDelayTooltip = true" @mouseleave="showDelayTooltip = false">
              <InfoIcon class="h-4 w-4 text-gray-400" />
              <div v-if="showDelayTooltip" class="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg -mt-2 ml-2">
                Simulates loading time before the response is returned (default: 1 seconds)
              </div>
            </div>
          </div>
          <input 
            id="responseDelay" 
            type="number" 
            v-model.number="config.responseDelay" 
            min="0" 
            max="30"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <!-- API Route Configuration -->
      <div class="mb-6">
        <div class="flex items-center mb-2">
          <label for="apiRoute" class="font-medium text-gray-700 mr-2">API Route</label>
          <div class="relative inline-block" @mouseenter="showRouteTooltip = true" @mouseleave="showRouteTooltip = false">
            <InfoIcon class="h-4 w-4 text-gray-400" />
            <div v-if="showRouteTooltip" class="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg -mt-2 ml-2">
              The endpoint path that will be used (e.g., investments/v2/home/portfolios)
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <input 
            id="apiRoute" 
            type="text" 
            v-model="config.apiRoute" 
            placeholder="mock"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        
          />
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>
      
      <!-- Mock Data Configuration -->
      <div class="mb-6">
        <div class="flex items-center mb-2">
          <label for="mockData" class="font-medium text-gray-700 mr-2">Mock Data (JSON)</label>
          <div class="relative inline-block" @mouseenter="showDataTooltip = true" @mouseleave="showDataTooltip = false">
            <InfoIcon class="h-4 w-4 text-gray-400" />
            <div v-if="showDataTooltip" class="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg -mt-2 ml-2">
              The JSON data that will be returned by the mock API
            </div>
          </div>
        </div>
        <textarea v-model="mockDataText" id="editor"></textarea>
        <p v-if="jsonError" class="mt-1 text-sm text-red-600">{{ jsonError }}</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center">
        <div>
          <p v-if="saveSuccess" class="text-sm text-green-600 mb-2">Configuration saved successfully!</p>
          <p class="text-sm text-gray-600">
            Your mock API will be available at: 
            <span class="font-mono bg-gray-100 px-1 py-0.5 rounded">
              http://localhost:3000/{{ config.apiRoute }}
            </span>
          </p>
        </div>
        <button 
          @click="saveConfig" 
          class="px-4 py-2 bg-blue-600 flex items-center justify-center text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer w-[180px] h-[40px]"
          :disabled="isLoading || !!jsonError"
        >
          <span v-if="isLoading" class="flex items-center justify-center animate-spin h-5 w-5">
            <LoaderCircleIcon />
          </span>
          <span v-else>
            Save Configuration
          </span>
        </button>
      </div>
    </div>

    <!-- API Routes Section -->
    <div class="bg-gray-100 " v-if="routes.length > 0">
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Mock API Routes</h1>
        
        <div v-if="routes.length > 0" class="space-y-4">
          
          <ul>
            <li v-for="route in routes" :key="route" class="flex justify-between items-center gap-2 text-gray-600">
              <button class="font-mono text-blue-500 hover:bg-gray-200 p-2 rounded-sm cursor-pointer w-full text-start" @click="openMockConfigModal(route)">{{ route }}</button>
            
              <button 
                @click="deleteRoute(route)"
                class="flex items-center justify-center p-2 rounded-full transition cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Delete route"
              >
                <Trash2Icon color="#FF6961" size="15"/>
              </button>
            </li>
          </ul>
        </div>

         <span v-else class="flex items-center justify-center animate-spin h-5 w-5">
            <LoaderCircleIcon />
          </span>
      </div>
    </div>

    <MockConfigModal 
      :isOpen="isModalOpen"
      :route="selectedRoute"
      @close="closeMockConfigModal"
      @delete-route="deleteRoute"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { InfoIcon, Trash2Icon, LoaderCircleIcon } from 'lucide-vue-next';
import MockConfigModal from '../components/MockConfigModa.vue';
import { deleteRouteService, fetchRoutesService, saveConfigService } from '@/services/routes';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

const showErrorTooltip = ref(false);
const showDelayTooltip = ref(false);
const showRouteTooltip = ref(false);
const showDataTooltip = ref(false);

const config = reactive({
  simulateError: false,
  responseDelay: 1,
  apiRoute: 'mock',
});

const mockDataText = ref('{\n  "title": "Lorem"\n}');
const jsonError = ref('');
const saveSuccess = ref(false);
const routes = ref([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const selectedRoute = ref('');
const errorMessage = ref('');

const openMockConfigModal = (route) => {
  selectedRoute.value = route;
  isModalOpen.value = true;
};

const closeMockConfigModal = () => {
  isModalOpen.value = false;
};

const validateJson = () => {
  try {
    if (mockDataText.value.trim()) {
      JSON.parse(mockDataText.value);
      jsonError.value = '';
    }
  } catch (e) {
    jsonError.value = `Invalid JSON: ${e.message}`;
  }
};

const saveConfig = async () => {
  isLoading.value = true;
  try {
    const response = await saveConfigService(config, mockDataText.value)

    if (response.ok) {
      saveSuccess.value = true;
      setTimeout(() => { saveSuccess.value = false; }, 3000);
    } else {
      throw new Error('Failed to save configuration');
    }
  } catch (error) {
    console.error('Error saving configuration:', error);
    alert('Failed to save configuration. Please check the console for details.');
  } finally {
    isLoading.value = false;
  }
};

const fetchRoutes = async () => {
  try {
    const response = await fetchRoutesService();
    if (response.ok) {
      routes.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
};

const deleteRoute = async (route) => {
  const routeToDelete = route.replace(/^\/+|\/+$/g, ''); 

  try {
    const response = await deleteRouteService(routeToDelete)

    if (response.ok) {
      console.log('Route deleted successfully');
      routes.value = routes.value.filter(r => r !== route);
    } else {
      const errorData = await response.text(); 
      alert(`Error: ${errorData}`);
    }
  } catch (error) {
    console.error('Error deleting route:', error);
    alert('Failed to delete route');
  }
};

watch(saveSuccess, (newValue) => {
  if (newValue) {
    fetchRoutes();
    saveSuccess.value = false; 
  }
});

onMounted(() => {
  const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    theme: 'dracula',
    mode: 'application/json',
    autocorrect: true,
    spellcheck: true,
  });

  editor.on('change', (instance) => {
    mockDataText.value = instance.getValue();
    validateJson();
  });
  editor.setSize("100%", "400")
})

onMounted(async () => {
  await fetchRoutes();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
</style>