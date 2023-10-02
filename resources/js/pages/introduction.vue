<script setup>
import { router } from '@inertiajs/vue3';

const navigateSurvey = () => {
  router.get(route('survey.index'));
};
</script>

<template>
  <VApp>
    <VContainer>
      <VRow justify="center">
        <VCol cols="12" xl="6" lg="9" md="12">
          <div class="text-right bg-primary px-3 py-5">
            <img style="max-width: 200px" src="/img/logo/15xb_logo.png" alt="" />
          </div>

          <h1 class="text-h4 text-primary font-weight-bold my-10">
            First Nations Benchmarking Assessment Questionnaire
          </h1>
          <p class="font-weight-bold text-h6 text-black">Acknowledgement:</p>

          <p class="text-black text-justify mb-10">
            We acknowledge the Traditional Owners of country throughout Australia. We pay our respects to Elders past,
            present and emerging and celebrate the diversity of Aboriginal and Torres Strait Islander peoples and their
            ongoing culture and connection to lands, waters and skies.
          </p>

          <p class="font-weight-bold text-h6 text-black">About this questionnaire:</p>
          <i class="text-black text-justify"
            >Empowering Australian organisations to create lasting impact for Aboriginal and Torres Strait Islander
            peoples</i
          >
          <p class="text-black text-justify mt-4">
            15 Times Better’s proprietary benchmarking assessment tool evaluates the maturity level and performance of
            an organisations First Nations engagement activity. The questions you will be asked relate to 15 Times
            Better’s proven seven key success factors that are crucial for successful and sustainable First Nations
            engagement outcomes and impact.
          </p>
          <p class="text-black text-justify mb-10">
            Your responses will enable us to determine your organisations maturity rating against each of the key
            success factors, highlighting strengths, gaps and opportunities, providing a clear roadmap for improving
            your First Nations engagement to create greater impact.
          </p>

          <div class="mb-10" style="font-size: .9rem; background-color: #f0f0f0; padding: 10px">
             <p style="font-size: 1.1rem" class="font-weight-bold  text-black">Use of the term First Nations:</p>
           
           <p class="text-black text-justify">
            To reflect the national scale of our work, 15 Times Better have chosen to use the term First Nations to
            refer to Aboriginal and Torres Strait Islander peoples. We respect and acknowledge the diversity of
            communities, identities, and clan groups for all First Nations people of Australia.
          </p>
          <p class="text-black text-justify ">
            While we recognise First Nations peoples have differing preferences regarding the use of terms First
            Nations, Indigenous, Aboriginal and Torres Strait Islander, and that many may prefer to be known by their
            specific group name or Country as Traditional Owners and Custodians, the terminology used by 15 Times Better
            reflects a considered and deliberate approach.
          </p>
          </div>

          <!-- <p class="font-weight-bold text-h6 text-black">Use of the term First Nations:</p>
          <p class="text-black text-justify">
            To reflect the national scale of our work, 15 Times Better have chosen to use the term First Nations to
            refer to Aboriginal and Torres Strait Islander peoples. We respect and acknowledge the diversity of
            communities, identities, and clan groups for all First Nations people of Australia.
          </p>
          <p class="text-black text-justify mb-10">
            While we recognise First Nations peoples have differing preferences regarding the use of terms First
            Nations, Indigenous, Aboriginal and Torres Strait Islander, and that many may prefer to be known by their
            specific group name or Country as Traditional Owners and Custodians, the terminology used by 15 Times Better
            reflects a considered and deliberate approach.
          </p> -->

          <VRow justify="center">
            <VCol cols="auto">
              <VBtn @click="navigateSurvey">Start Survey</VBtn>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VApp>
</template>