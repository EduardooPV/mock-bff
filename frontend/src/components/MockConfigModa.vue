<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-[#00000080] flex items-center justify-center" @click.self="closeModal">
      <div class="bg-white p-8 pt-6 rounded-2xl shadow-2xl max-w-2/3 w-full flex flex-col">
        <div class="flex justify-end items-center">
          <button @click="closeModal"
            class="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 w-10 h-10 flex items-center justify-center rounded-full transition duration-200 cursor-pointer hover:bg-gray-200">
            <X />
          </button>
        </div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">Edit Mock API Route</h2>
        </div>

        <div v-if="routeData" class="flex-1 gap-6 flex flex-col">
          <!-- Response Delay -->
          <div class="flex gap-4">
            <!-- Name -->
            <div class="flex-1/4">
              <label for="routeName" class="font-medium text-gray-700 mb-2 block">Route Name</label>
              <input 
                id="routeName" 
                type="text" 
                v-model="routeData.name" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Response Delay -->
            <div class="flex-1">
              <label for="responseDelay" class="font-medium text-gray-700 mb-2 block">Response Delay (seconds)</label>
              <input 
                id="responseDelay" 
                type="number" 
                v-model.number="routeData.responseDelay" 
                min="0" 
                max="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

             <div class="w-[150px] flex flex-col">
            <div class="flex items-center">
              <label for="simulateError" class="font-medium text-gray-700 mr-2 ">Simulate Error</label>
              <div class="relative inline-block" @mouseenter="showErrorTooltip = true" @mouseleave="showErrorTooltip = false">
                <InfoIcon class="h-4 w-4 text-gray-400" />
                <div v-if="showErrorTooltip" class="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg -mt-2 ml-2">
                  When enabled, the API will return a 500 error instead of the mock data
                </div>
              </div>
            </div>
            <div class="flex items-center flex-1">
              <input 
                id="simulateError" 
                type="checkbox" 
                v-model="routeData.simulateError"
                class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <label for="simulateError" class="ml-2 text-sm text-gray-600 cursor-pointer">
                {{ routeData.simulateError ? 'Error response' : 'Normal response' }}
              </label>
            </div>
          </div>
          </div>

          

          <!-- Mock Data -->
          <div>
            <label for="mockData" class="font-medium text-gray-700 flex flex-col mb-2">Mock Data (JSON)</label>
            <textarea id="editorPreview"></textarea>
          </div>

          <button 
            @click="saveChanges" 
            class="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer w-[180px] h-[40px]"
          >
            Save Changes
          </button>
        </div>
        <span v-else class="flex items-center justify-center animate-spin h-5 w-5">
          <LoaderCircleIcon />
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount, nextTick } from 'vue';
import { LoaderCircleIcon, X, InfoIcon } from 'lucide-vue-next';
import { fetchRouteDataService, saveConfigService } from '@/services/routes';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js'; // Adicione o modo JavaScript para JSON

const props = defineProps({
  route: String,
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'updateRoutes']);

const routeData = ref(null);
const showErrorTooltip = ref(false);
let editor = null;

const fetchRouteData = async (route) => {
  if (!route) return;

  try {
    const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;

    const response = await fetchRouteDataService(normalizedRoute);
    if (response.ok) {
      const data = await response.json();
      routeData.value = { ...data, apiRoute: data.path };

      await nextTick();

      // Inicializar ou atualizar o editor CodeMirror
      if (!editor) {
        initializeEditor();
      }

      // Atualizar o valor do editor com os dados formatados
      editor.setValue(JSON.stringify(data.mockData, null, 2));
    } else {
      console.error(`Failed to fetch data for route: ${route}`);
    }
  } catch (error) {
    console.error('Error fetching route data:', error);
  }
};

const initializeEditor = () => {
  const textarea = document.getElementById('editorPreview');
  if (!textarea) return;

  editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    theme: 'dracula',
    mode: 'application/json', // Define o modo como JSON
  });

  editor.on('change', (instance) => {
    try {
      routeData.value.mockData = JSON.parse(instance.getValue());
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  });

  editor.setSize("100%", "400");
};

const destroyEditor = () => {
  if (editor) {
    editor.toTextArea(); // Destroi o editor e retorna o textarea ao estado original
    editor = null;
  }
};

const saveChanges = async () => {
  try {
    const updatedMockData = JSON.parse(editor.getValue());
    const updatedConfig = {
      ...routeData.value,
      mockData: updatedMockData,
    };

    const response = await saveConfigService(updatedConfig, JSON.stringify(updatedMockData));
    if (response.ok) {
      emit('updateRoutes');
      emit('close');
    } else {
      alert('Failed to update configuration.');
    }
  } catch (error) {
    alert('Invalid JSON in Mock Data.');
    console.error('Error saving changes:', error);
  }
};

watchEffect(() => {
  if (props.isOpen && props.route) {
    fetchRouteData(props.route);
    document.body.style.overflow = 'hidden';
  } else {
    destroyEditor(); // Destroi o editor ao fechar o modal
    document.body.style.overflow = '';
  }
});

const closeModal = () => {
  emit('close');
};

onBeforeUnmount(() => {
  destroyEditor(); // Garante que o editor seja destruído ao desmontar o componente
});
</script>