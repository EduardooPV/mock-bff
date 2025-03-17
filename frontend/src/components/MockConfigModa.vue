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
          <h2 class="text-2xl font-semibold text-gray-800">Mock API Route</h2>
        </div>

        <div v-if="routeData" class="flex-1">
          <div class="flex justify-between items-center w-full mb-4">

            <p class="text-gray-700 text-lg ">
              <strong>Route:</strong> {{ routeData.route }}
            </p>

            <button @click="deleteRoute(route)"
              class="flex items-center justify-center p-2 rounded-full transition cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Delete route">
              <Trash2Icon color="#FF6961" size="15" />
            </button>
          </div>

          <textarea id="editorPreview"></textarea>
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
import { LoaderCircleIcon, Trash2Icon, X } from 'lucide-vue-next';
import { fetchRouteDataService } from '@/services/routes';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

const props = defineProps({
  route: String,
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'deleteRoute']);

const routeData = ref(null);

const fetchRouteData = async (route) => {
  if (!route) return;


  try {
    const response = await fetchRouteDataService(route);
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
      editor.setSize("100%", "400")
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

const deleteRoute = (route) => {
  emit('deleteRoute', route)
  emit('close');
}

const closeModal = () => {
  emit('close');
};

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});

</script>