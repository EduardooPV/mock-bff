<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-[#00000080] flex items-center justify-center" 
      @click.self="closeModal"
    >
      <div class="bg-white p-8 pt-6 rounded-2xl shadow-2xl max-w-2/3 w-full">
        <div class="flex justify-end items-center">
          <button 
            @click="closeModal" 
            class="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 w-10 h-10 flex items-center justify-center rounded-full transition duration-200 cursor-pointer hover:bg-gray-200"
          >
           <X />
          </button>
        </div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">Mock API Route</h2>
        </div>
        
        <div v-if="routeData">
          <p class="text-gray-700 text-lg mb-4">
            <strong>Route:</strong> {{ routeData.route }}
          </p>

          <textarea id="editorPreview"></textarea>
        </div>
        <div v-else class="text-center text-gray-500 text-lg">
          Loading...
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount, nextTick } from 'vue';
import { X } from 'lucide-vue-next';
import { fetchRouteDataService } from '@/services/routes';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

const props = defineProps({
  route: String,
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const routeData = ref(null);

const fetchRouteData = async (route) => {
  if (!route) return;

  const cleanRoute = route.replace(/^\/?api\/?/, '');

  try {
    const response = await fetchRouteDataService(cleanRoute);
    if (response.ok) {
      const data = await response.json();

      routeData.value = data

      await nextTick();

      const editor = CodeMirror.fromTextArea(document.getElementById('editorPreview'), {
        lineNumbers: true,
        autoCloseBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        readOnly: true,
        theme: 'dracula',
        mode: 'application/json',
      });

      editor.setValue(JSON.stringify(data.mockData, null, 2));
    } else {
      console.error(`Failed to fetch data for route: ${route}`);
    }
  } catch (error) {
    console.error('Error fetching route data:', error);
  }
};

watchEffect(() => {
  if (props.isOpen && props.route) {
    fetchRouteData(props.route);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const closeModal = () => {
  emit('close');
};

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});

</script>