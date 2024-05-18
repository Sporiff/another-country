<script setup>
import { ref } from 'vue';

const props = defineProps({
   endpoint: String,
});

const initialForm = {
   name: '',
   email: '',
   subject: '',
   html: '',
};

const formData = ref({ ...initialForm });
const loading = ref(false);
const submissionResult = ref(null);

const handleSubmit = async () => {
   loading.value = true;
   submissionResult.value = null;

   try {
      const response = await fetch(props.endpoint, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            query: `
          mutation {
            sendEmail(
              input: {
                from: "${formData.value.name} <${formData.value.email}>",
                subject: "${formData.value.subject}",
                body: "${formData.value.html}",
                clientMutationId: "${formData.value.subject}"
              }
            ) {
              sent
              message
            }
          }
        `,
         }),
      });

      const result = await response.json();
      const { message } = result.data.sendEmail;

      submissionResult.value = 'success';
      console.log(`Form submitted successfully: ${message}`);
   } catch (error) {
      submissionResult.value = 'error';
      console.error('Error submitting form:', error);
   } finally {
      formData.value = { ...initialForm };
      loading.value = false;
   }
};
</script>

<template>
   <div>
      <div v-if="loading" class="border border-blue-300 shadow rounded-md p-4 w-full max-w-lg mx-auto">
         <div class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-gray-200 h-10 w-10"></div>
            <div class="flex-1 space-y-6 py-1">
               <div class="h-2 bg-gray-200 rounded"></div>
               <div class="space-y-3">
                  <div class="grid grid-cols-3 gap-4">
                     <div class="h-2 bg-gray-200 rounded col-span-2"></div>
                     <div class="h-2 bg-gray-200 rounded col-span-1"></div>
                  </div>
                  <div class="h-2 bg-gray-200 rounded"></div>
               </div>
            </div>
         </div>
      </div>
      <form v-if="!loading" class="w-10/12 md:w-full max-w-lg" @submit.prevent="handleSubmit">

         <div v-if="submissionResult === 'success'"
              class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Message successfully sent.
         </div>
         <div v-if="submissionResult === 'error'"
              class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            There was a problem sending this message.
         </div>

         <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
               <label for="email" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Email address
               </label>
               <input
                      id="email"
                      name="email"
                      type="email"
                      class="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      placeholder="you@email.com"
                      v-model="formData.email"
                      required />
            </div>
            <div class="w-full md:w-1/2 px-3">
               <label for="name" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Name
               </label>
               <input
                      id="name"
                      name="name"
                      type="text"
                      class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      v-model="formData.name"
                      required
                      placeholder="Joe Bloggs" />
            </div>
         </div>
         <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3">
               <label for="subject" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Subject
               </label>
               <input
                      id="subject"
                      name="subject"
                      type="text"
                      class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      v-model="formData.subject"
                      placeholder="What do you want to talk about?"
                      required />
            </div>
         </div>
         <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3">
               <label for="html" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Message
               </label>
               <textarea
                         id="html"
                         name="html"
                         class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                         v-model="formData.html"
                         placeholder="Write something nice!"></textarea>
            </div>
         </div>
         <div class="flex items-center justify-between">
            <input
                   type="submit"
                   value="Submit"
                   class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                   :disabled="loading" />
         </div>
      </form>
   </div>
</template>