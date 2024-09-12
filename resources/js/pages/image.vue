<script setup>
import Dropzone from '../components/global/Dropzone.vue';
import { ref } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';
import { VBtn } from 'vuetify/components'; // Ensure Vuetify components are properly imported

// Define form data with useForm
const form = useForm({
  caption: '',
  uploads: []
});

const responseData = ref(null);


// Function to handle form submission
const handleSave = async () => {
  try {
    // Create a FormData object
    const formData = new FormData();

    for (const file of form.uploads) {
      formData.append('uploads[]', file.file);
    }
    const response = await axios.post('/sample', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Handle the response data
    console.log('Success:', response.data);

    responseData.value = response.data.ocrResponses
    console.log('OCR Responses:', response.data.ocrResponses);
    console.log('Message:', response.data.message);

    // Reset the form if needed
    form.reset();
  } catch (error) {
    // Handle errors
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};
</script>

<template>
  <div class="d-flex align-center justify-center">
    <VRow class="justify-center align-center my-10">
      <div>
        <Dropzone v-model="form.uploads" placeholder="Drag and drop files here or click to select files" />
        <div class="d-flex justify-end">
          <VBtn @click="handleSave" color="primary" class="text-white"> Submit </VBtn>
        </div>
      </div>
    </VRow>
   
  </div>
  <VDivider/>
  <div class="d-flex align-center justify-center mt-10" v-if="responseData">
    
  <VCard variant="outlined" max-width="800" class="py-10 px-5">
    <div v-for="(data, index) in responseData" class="mb-10">

       <p>{{index+1}}: {{ data.ParsedResults[0]['ParsedText'] }}</p> 
    </div>
    </VCard>    
</div>
</template>

<style scoped>
/* Add custom styles here if needed */
</style>
