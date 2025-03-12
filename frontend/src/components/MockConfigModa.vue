<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-[#00000080] flex items-center justify-center" 
      @click.self="closeModal"
    >
      <div class="bg-white p-8 pt-6 rounded-2xl shadow-2xl max-w-lg w-full">
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
          <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-60 border border-gray-300">
            {{ routeData.mockData }}
          </pre>
        </div>
        <div v-else class="text-center text-gray-500 text-lg">
          Loading...
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { X } from 'lucide-vue-next';
import { fetchRouteDataService } from '@/services/routes';

const props = defineProps({
  route: String,
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const routeData = ref(null);

const fetchRouteData = async (route) => {
  console.log(route)
  if (!route) return;

  const cleanRoute = route.replace(/^\/?api\/?/, '');

  try {
    const response = await fetchRouteDataService(cleanRoute);
    if (response.ok) {
      const data = await response.json();
      routeData.value = data
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