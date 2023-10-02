<script setup>
import Layout from '@/layouts/default.vue';
import { usePage, Link } from '@inertiajs/vue3';

const survey = computed(() => {
    return usePage().props.survey
})
</script>

<script>
export default {
  name: 'Dashboard',
  layout: (h, page) => h(Layout, [page]),
};
</script>

<template>
    <VRow justify="end" class="mb-2">
        <VCol cols="auto">
            <Link :href="route('survey_responses.index')">
                <VBtn>Back</VBtn>
            </Link>
        </VCol>
    </VRow>
    <template v-if="survey">
        <template v-for="question in survey.responses">
        <VCard class="mb-2">
            <VCardText>
                <h1 class="text-h6 mb-5">{{question.order}}. {{ question.question }}</h1>
                <p class="text-sm mb-0">Answer/s:</p>
                

             <template v-if="question.type == 'table/subquestions'">
                <VTable v-if="question.options.type == 'table-yes-no-textfield'">
                    <thead>
                        <tr>
                            <th rowspan="2">Initiative</th>
                            <th colspan="2">Is the organisation / partner First Nations owned and led</th>
                        </tr>
                        <tr>
                            <th>Yes</th>
                            <th>No</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="answer in question.answer">
                            <td>{{ answer.value }}</td>
                            <td><VIcon v-if="answer.yes_no == 'Yes'"  icon="mdi-check"></VIcon></td>
                            <td><VIcon v-if="answer.yes_no == 'No'"  icon="mdi-check"></VIcon></td>
                        </tr>
                    </tbody>
                </VTable>
                <VTable v-if="question.options.type == 'label-textfield'">
                    <tbody>
                        <template v-for="item in question.answer">
                            <tr>
                                <td style="width:350px;">{{ item.label }}</td>
                                <td>{{ item.value }}</td>
                            </tr>
                        </template>
                    </tbody>
                </VTable>
                        <VTable v-if="question.options.type == 'table-2col-3year-list'">
                            <tbody>
                                <template v-for="(year, index) in question.answer">
                                    <template v-for="(answer, answerIndex) in year">
                                        <tr>
                                            <td><span v-if="answerIndex">{{ index }}</span></td>
                                            <td>{{ answer.key }}</td>
                                            <td>{{ answer.answer ?? '-' }}</td>
                                        </tr>
                                    </template>
                                </template>
                            </tbody>
                        </VTable>
                    </template>
                    <template v-else-if="question.type == 'upload'">
                        <ul>
                            <li v-for="answer in question.answer">
                                <a :href="answer" target="_blank">{{ answer }}</a>
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <template v-if="question.answer">
                            <p v-if="question.answer.constructor.name == 'String'">
                                {{ question.answer }}
                            </p>
                            <template v-if="question.answer.constructor.name == 'Array'">
                                <ul>
                                    <li v-for="answer in question.answer">{{ answer }}</li>
                                </ul>
                            </template>
                        </template>
                    </template>
            </VCardText>        
        </VCard>
    </template>
    </template>
</template>

