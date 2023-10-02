<script setup>
import { router, useForm, usePage } from '@inertiajs/vue3';
import { debounce } from 'lodash'
import { computed } from 'vue';

const questions = computed(() => {
  return usePage().props.questions;
});

const uuid = computed(() => {
  return usePage().props.uuid;
});

const survey = computed(() => {
  return usePage().props.survey;
});

const success = computed(() => {
  return usePage().props.success;
});

const firstKey = computed(() => {
    return usePage().props.first_key
})

const d = new Date();
const todayYear = d.getFullYear();
const years = [
  `${todayYear - 2} - ${todayYear -1}`,
];

const fileValidation =   [
    value => {
        return !value || !value.length || file.size <= 10 * 1024 * 1024 || 'File is too big (Max 10MB)'
    },
];

const form = useForm({
    questions: null,
    uuid: null,
});

const initialPage = ref(0);

const movingState = ref('forward');

watch(initialPage, (newVal, oldVal) => {
  if (newVal > oldVal) {
    movingState.value = 'forward';
  } else {
    movingState.value = 'backward';
  }
  window.scrollTo(0, 0);
});

onMounted(() => {
  
    if(uuid.value)
    {
      form.questions = JSON.parse(JSON.stringify(questions.value));
      form.uuid = uuid.value;
      saveExitForm.first_name = survey.value.first_name;
      saveExitForm.email = survey.value.email;
      saveExitForm.last_name = survey.value.last_name;
    }else {
      form.questions = JSON.parse(JSON.stringify(questions.value.map(question => {
        const dt = question['questions'].map(q => {
            return {
                ...q,
                answer: handleDefaultAnswer(q),
            }
        });

        return {
            ...question,
            questions: dt,
        }
    })));
    }
    
})

// watch(
//   questions,
//   val => {
//     form.value = JSON.parse(JSON.stringify(val));
//   },
//   {
//     immediate: true,
//     deep: true
//   }
// );

const handleDefaultAnswer = (question) => {
    
    if(question.type == '5 textfields')
    {
        return ["", "", "", "", ""]
    }

    if(question.type == '3 textfields')
    {
        return ["", "", ""]
    }

    if(question.type == '6 textfields')
    {
       return ["", "", "","", "", ""];
    }

    if(question.type == '10 textfields')
    {
       return ["", "", "","", "", "", "", "", "", ""];
    }

    if(question.type == 'multi select, multi choice')
    {
        return [];
    }
     if(question.type == 'multi select, multi choice, textarea')
    {
        return [];
    }

    if(question.type == 'table/subquestions' && question.options.type == "table-yes-no-textfield")
    {
        return [
            { "value" : null, "yes_no" : null },
            { "value" : null, "yes_no" : null },
            { "value" : null, "yes_no" : null },
            { "value" : null, "yes_no" : null },
            { "value" : null, "yes_no" : null },
        ]
    }

    if(question.type == 'table/subquestions' && question.options.type == "label-textfield")
    {
        let answers = [];

        question.options.fields.forEach(element => {
            answers.push({
                label: element,
                value: null,
            })    
        });
        
        return answers;
    }
    
    if(question.type == 'scale')
    {
        return 0;
    }

    if(question.type == 'table/subquestions' && question.options.type == 'table-2col-3year-list')
    {
        var answer = {};

        for (let index = 0; index < years.length; index++) {
            const year = years[index];

            answer[year] = [];

            for (let fieldIndex = 0; fieldIndex < question.options.fields.length; fieldIndex++) {
                const element = question.options.fields[fieldIndex];

                answer[year].push({
                    'key' : element,
                    'answer' : null,
                })
            }
        }

        return answer;
    }

    if(question.type == 'table/subquestions' && question.options.type == 'table-2col-3year-list-upload')
    {
        var answer = {};

        for (let index = 0; index < years.length; index++) {
            const year = years[index];

            answer[year] = [];

            for (let fieldIndex = 0; fieldIndex < question.options.fields.length; fieldIndex++) {
                const element = question.options.fields[fieldIndex];

                answer[year].push({
                    'key' : element,
                    'answer' : null,
                })
            }
        }

        return answer;
    }

    return "";
}

const charLimit = (value) => {

  if(value.length > 255)
  {
    return String(value).substring(0, 255)
  }

  return value;
}

const handleUpdate = debounce(($event, question, index = 0) => {

    if(question.type == 'multi-choice' || question.type == 'multi choice, textarea' || question.type == 'scale' || question.type == 'textarea')
    {
        question.answer = $event;
    }

    if(question.type == 'textfield')
    {
        question.answer = charLimit($event);
    }

    if(question.type == '5 textfields')
    {
        question.answer[index] = charLimit($event)
    }

    if(question.type == '3 textfields')
    {
        question.answer[index] = charLimit($event)
    }

    if(question.type == '6 textfields')
    {
        question.answer[index] = charLimit($event)
    }

    if(question.type == '10 textfields')
    {
        question.answer[index] = charLimit($event)
    }

    if(question.type == 'multi select, multi choice')
    {
        question.answer = $event
    }
     if(question.type == 'multi select, multi choice, textarea')
    {
        question.answer = $event
    }

}, 50)

const calculateProgress = computed(() => {
  const totalPages = form.questions.length;
  const currentPage = initialPage.value;

  return ((currentPage + 1) / totalPages) * 100;
});

const submit = () => {

  
    form
    .transform((data) => {
        return {
            uuid: data.uuid,
            questions: data.questions.map(question => {
                return {
                    questions:question.questions.map(q => {
                        
                        if(q.type == 'table/subquestions' && q.options.type == 'table-2col-3year-list-upload' )
                        {
                            let answer = {};

                            for (const key in q.answer) {
                                answer[key] = q.answer[key].map(a => {
                                    return {
                                        ...a,
                                        answer: a?.answer_media ? a.answer_media : a.answer,
                                    }
                                });
                            }

                            return {
                                id: q.id,
                                answer: answer,
                                others: q?.others,
                                answer_none: q?.answer_none,
                            }
                        }

                        return {
                            id: q.id,
                            answer: q?.answer_media ? q.answer_media : q.answer,
                            others: q?.others,
                            answer_none: q?.answer_none,
                        }
                    }),
                }
            }),
        }
    })
    .post(route('survey.store'))
}

const handleFile = (file, question) => {
	const allowedTypes = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'text/csv',
		'application/pdf',
		'application/msword',
		'application/msexcel',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	];

	console.log(question.id)
	question.error = [];

    if(file.length > 0 && file[0])
    {
        question.error = [];
		if (allowedTypes.includes(file[0].type)) {
			if(file[0].size <= 10 * 1024 * 1024)
			{ 
				question.answer = file
				question.answer_media = null
				question.hasError = false;
			} else {
				question.answer = null
				question.error = ['File size is too big (Max 10MB)'];
			}
		} else {
			console.log(file[0]);
			question.answer = null;
			question.error = ['Invalid file type'];
		}
    }
}

const saveExitForm = useForm({
  first_name: null,
  last_name: null,
  email: null,
  uuid: null,
  draft_questions: null,
});

const saveExitSuccessFull = ref(false)
const saveExitModal = ref(false);
const saveExit = () => {
  console.table(form);
  saveExitForm.draft_questions = form.questions;
 
  if(uuid.value)
  {
    saveExitForm.uuid = uuid.value;
  }
  
  saveExitForm
  .transform((data) => {
        return {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          uuid: data.uuid,
          draft_questions: data.draft_questions.map(question => {
                return {
                    key: question.key,
                    questions:question.questions.map(q => {
                        if(q.type == 'table/subquestions' && q.options.type == 'table-2col-3year-list-upload' )
                        {
                            let answer = {};

                            for (const key in q.answer) {
                                answer[key] = q.answer[key].map(a => {
                                    return {
                                        ...a,
                                        answer: a?.answer_media ? a.answer_media : a.answer,
                                    }
                                });
                            }

                            return {
                                id: q.id,
                                answer: answer,
                                others: q?.others,
                                answer_none: q?.answer_none,
                            }
                        }

                        return {
                            id: q.id,
                            answer: q?.answer_media ? q.answer_media : q.answer,
                            others: q?.others,
                            answer_none: q?.answer_none,
                        }
                    }),
                }
            }),
        }
    })
  .post(route('survey.saveAsDraft'), {
    onSuccess: () => {
      saveExitSuccessFull.value = true;
      saveExitModal.value = false;

      setTimeout(() => {
        router.get(route('introduction'))
      }, 3000)
    },
  });
}

const modifyTitle = (title) => {
 return (['Community Engagement', 'Employment', 'Supplier Diversity'].includes(title)?`Opportunities - ${title}`:title).replace('Assessing ', '').replace('&', 'and');
}

const subDescription = {
  'About your Organisation' : 'The following questions relate to your organisation and industry.',
  'Assessing Strategic Rationale' : 'The following questions relate to the alignment of your organisations core purpose and First Nations engagement.',
  'Employment' : 'The following questions relate to the systems, policies and procedures your organisation has in place to support First Nations recruitment, retention and career development.',
  'Supplier Diversity' : 'The following questions relate to the systems, policies and procedures your organisation has in place to support First Nations supplier engagement.',

  // 'Community Engagement' : 'We would now like to look at how your organisation conducts community engagement activities that address First Nations issues relevant to your organisation.',
  'Community Engagement' : 'The following questions relate to the First Nations community activities, initiatives and causes that your organisation supports.',
  'Governance & Leadership' : 'The following questions relate to the oversight of your overall First Nations strategy / RAP.',
  'Cultural Respect' : 'The following questions relate to how your organisation recognises, protects and advances recognition, protection and continued advancement of the inherent rights, cultures and traditions of a particular culture.',
};
</script>

<template>
  <VApp>
    <VContainer>
      <VRow justify="center">
        <VCol cols="12" xl="6" lg="9" md="12">
          <div class="text-right bg-primary px-3 py-5">
            <img style="max-width:200px" src="/img/logo/15xb_logo.png" alt="" />
          </div>
        </VCol>
      </VRow>
      <TransitionGroup
        name="custom-classes"
        enter-active-class="animate__animated animate__fadeIn"
      >
        <!-- :enter-active-class="`animate__animated animate__${movingState == 'forward' ? 'slideInRight' : 'slideInLeft'}`" -->
        <template v-for="(groupQuestion, index) in form.questions" :key="index">
          <VRow justify="center" v-if="initialPage == index">
            <VCol cols="12" xl="6" lg="9" md="12">
              <h1 class="text-h5 text-primary text-right px-3 font-weight-bold text-bold mt-4 mb-2">{{ modifyTitle(groupQuestion.key) }}</h1>
              <p class="mb-5 px-3 text-right">{{ subDescription[groupQuestion.key] }}</p>
              <p class="mb-5 px-3 text-right " v-if="groupQuestion.key === 'Cultural Respect'">The oversight of your overall First Nations strategy / RAP.</p>
              <!-- <h3 class="text-h6 text-center mb-5 text-caption font-weight-bold ">Please fill out this survey</h3> -->
              <!-- <h6 class="font-weight-bold d-flex justify-content-end">Page: {{ initialPage + 1}}/{{ form.questions.length }}</h6> -->
              <VProgressLinear v-model="calculateProgress" height="9" color="primary"></VProgressLinear>

              <template v-for="(question, questionIndex) in groupQuestion.questions" :key="questionIndex">
                <VCard class="mb-2 mt-5">
                  <VCardText>
                    <h1 class="text-subtitle-1 font-weight-bold custom__questions-label"><span class="text-primary">{{ question.order }}.</span> {{ question.question }}</h1>
                    
                    <VTextField 
                      v-if="question.type == 'textfield'" 
                      :model-value="question.answer" 
                      @update:model-value="handleUpdate($event, question)" 
                      class="mb-2"
                      :hide-details="question.answer && question.answer.length == 255 ? false : true"
                      :messages="[typeof question.answer == 'string' && question.answer.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                    >
                    </VTextField>
                   
                    <VTextarea
                      v-if="question.type == 'textarea'" 
                      :model-value="question.answer"
                      @update:model-value="handleUpdate($event, question)"
                    ></VTextarea>

                    <template v-if="question.type == 'multi select, multi choice'">
                      <VCheckbox
                        v-for="option in question.options" :key="option" :label="option.option" :value="option.option" :model-value="question.answer"
                        @update:model-value="handleUpdate($event, question)"
                      ></VCheckbox>
                    </template>

                    <template v-if="question.type == 'multi select, multi choice, textarea'">
                      <VCheckbox
                        v-for="option in question.options" :key="option" :label="option.option == 'Other'?'Other (Please specify)'.replace('specify', 'list'):option.option" :value="option.option" v-model="question.answer"
                      ></VCheckbox>
                      <VTextarea placeholder="Please list" v-if="question.answer?.includes('Other')" v-model="question.others"></VTextarea>
                    </template>

                    <template v-if="question.type == '3 textfields'">
                      <VTextField 
                        placeholder="Enter answer 1:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[0]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[0] : null" 
                        @update:model-value="handleUpdate($event, question, 0)"
                        :messages="[question.answer && question.answer[0]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 2:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[1]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[1] : null" 
                        :messages="[question.answer && question.answer[1]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                        @update:model-value="handleUpdate($event, question, 1)"
                      >
                      </VTextField>
                      <VTextField 
                        placeholder="Enter answer 3:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[2]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[2] : null" 
                        :messages="[question.answer && question.answer[2]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                        @update:model-value="handleUpdate($event, question, 2)"
                      >
                      </VTextField>
                    </template>

                    <template v-if="question.type == '6 textfields'">
                      <VTextField 
                        placeholder="Enter answer 1:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[0]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[0] : null" 
                        @update:model-value="handleUpdate($event, question, 0)"
                        :messages="[question.answer && question.answer[0]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 2:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[1]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[1] : null" 
                        @update:model-value="handleUpdate($event, question, 1)"
                        :messages="[question.answer && question.answer[1]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 3:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[2]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[2] : null" 
                        @update:model-value="handleUpdate($event, question, 2)"
                        :messages="[question.answer && question.answer[2]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 4:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[3]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[3] : null" 
                        @update:model-value="handleUpdate($event, question, 3)"
                        :messages="[question.answer && question.answer[3]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 5:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[4]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[4] : null" 
                        @update:model-value="handleUpdate($event, question, 4)"
                        :messages="[question.answer && question.answer[4]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 6:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[5]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[5] : null" 
                        @update:model-value="handleUpdate($event, question, 5)"
                        :messages="[question.answer && question.answer[5]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                    </template>
                    <template v-if="question.type == '6 textfields'">
                      <VTextField 
                        placeholder="Enter answer 1:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[0]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[0] : null" 
                        @update:model-value="handleUpdate($event, question, 0)"
                        :messages="[question.answer && question.answer[0]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 2:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[1]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[1] : null" 
                        @update:model-value="handleUpdate($event, question, 1)"
                        :messages="[question.answer && question.answer[1]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 3:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[2]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[2] : null" 
                        @update:model-value="handleUpdate($event, question, 2)"
                        :messages="[question.answer && question.answer[2]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 4:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[3]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[3] : null" 
                        @update:model-value="handleUpdate($event, question, 3)"
                        :messages="[question.answer && question.answer[3]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 5:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[4]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[4] : null" 
                        @update:model-value="handleUpdate($event, question, 4)"
                        :messages="[question.answer && question.answer[4]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 6:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[5]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[5] : null" 
                        @update:model-value="handleUpdate($event, question, 5)"
                        :messages="[question.answer && question.answer[5]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                    </template>

                    <!-- Start of 10 fields -->
                    
                    <template v-if="question.type == '10 textfields'">
                    <VTextField 
                        placeholder="Enter answer 1:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[0]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[0] : null" 
                        @update:model-value="handleUpdate($event, question, 0)"
                        :messages="[question.answer && question.answer[0]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 2:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[1]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[1] : null" 
                        @update:model-value="handleUpdate($event, question, 1)"
                        :messages="[question.answer && question.answer[1]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 3:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[2]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[2] : null" 
                        @update:model-value="handleUpdate($event, question, 2)"
                        :messages="[question.answer && question.answer[2]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 4:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[3]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[3] : null" 
                        @update:model-value="handleUpdate($event, question, 3)"
                        :messages="[question.answer && question.answer[3]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 5:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[4]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[4] : null" 
                        @update:model-value="handleUpdate($event, question, 4)"
                        :messages="[question.answer && question.answer[4]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 6:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[5]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[5] : null" 
                        @update:model-value="handleUpdate($event, question, 5)"
                        :messages="[question.answer && question.answer[5]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 7:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[6]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[6] : null" 
                        @update:model-value="handleUpdate($event, question, 6)"
                        :messages="[question.answer && question.answer[6]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 8:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[7]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[7] : null" 
                        @update:model-value="handleUpdate($event, question, 7)"
                        :messages="[question.answer && question.answer[7]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 9:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[8]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[8] : null" 
                        @update:model-value="handleUpdate($event, question, 8)"
                        :messages="[question.answer && question.answer[8]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 10:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[9]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[9] : null" 
                        @update:model-value="handleUpdate($event, question, 9)"
                        :messages="[question.answer && question.answer[9]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                    </template>
                    <!-- End of 10 fields -->
                    
                    <template v-if="question.type == '5 textfields'">
                      <VTextField 
                        placeholder="Enter answer 1:" 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[0]?.length == 255 ? false : true"
                        :model-value="question.answer ? question.answer[0] : null" 
                        @update:model-value="handleUpdate($event, question, 0)"
                        :messages="[question.answer && question.answer[0]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        placeholder="Enter answer 2:" 
                        class="mb-2"
                        :model-value="question.answer ? question.answer[1] : null" 
                        @update:model-value="handleUpdate($event, question, 1)"
                        :hide-details="question.answer && question.answer[1]?.length == 255 ? false : true"
                        :messages="[question.answer && question.answer[1]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[2]?.length == 255 ? false : true"
                        placeholder="Enter answer 3:" 
                        :model-value="question.answer ? question.answer[2] : null" 
                        @update:model-value="handleUpdate($event, question, 2)"
                        :messages="[question.answer && question.answer[2]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField  
                        class="mb-2"
                        :hide-details="question.answer && question.answer[3]?.length == 255 ? false : true"
                        placeholder="Enter answer 4:" 
                        :model-value="question.answer ? question.answer[3] : null" 
                        @update:model-value="handleUpdate($event, question, 3)"
                        :messages="[question.answer && question.answer[3]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VTextField 
                        class="mb-2"
                        :hide-details="question.answer && question.answer[4]?.length == 255 ? false : true"
                        placeholder="Enter answer 5:" 
                        :model-value="question.answer ? question.answer[4] : null" 
                        @update:model-value="handleUpdate($event, question, 4)"
                        :messages="[question.answer && question.answer[4]?.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                      ></VTextField>
                      <VCheckbox label="None" value="None" v-model="question.answer_none"></VCheckbox>
                    </template>

                    <template v-if="question.type == 'multi-choice'">
                      <VRadioGroup :model-value="question.answer" @update:model-value="handleUpdate($event, question)">
                        <VRadio
                          v-for="option in question.options"
                          :label="option.option"
                          :key="option"
                          :value="option.option"
                        ></VRadio>
                      </VRadioGroup>
                    </template>

                    <template v-if="question.type == 'upload'">
                      <div>
                        <VFileInput
                          accept=".xlsx,.xls,image/*,.doc,.docx,.csv,.pdf"
                          label="File input"
                          :error-messages="question?.error" :model-value="question.answer"
                          @update:model-value="handleFile($event, question)"
                          @click:clear="question.answer = null"
                        ></VFileInput>
                      </div>
                      <div class="mt-2" v-if="question.answer_media">
                        <template v-if="question.answer_media.constructor === Array">
                          <template v-for="item in question?.answer_media" :key="item">
                            <VRow no-gutters>
                              <VCol cols="auto">
                                <a :href="item['original_url']" target="_blank" rel="noopener noreferrer"> 
                                  * {{ item['file_name'] }}  
                                </a>
                              </VCol>
                              <VCol cols="auto">
                                <VTooltip text="Remove file">
                                  <template #activator="{ props }">
                                    <VBtn v-bind="props" size="small" variant="plain" class="text-error" @click="question.answer_media = null"> <VIcon icon="mdi-trash"></VIcon> </VBtn>
                                  </template>
                                </VTooltip>
                              </VCol>
                            </VRow>
                          </template>
                        </template>
                      </div>
                    </template>

                    <template v-if="question.type == 'scale'">
                      <VSlider
                        :ticks="{ ...question.options.map(val => val.option) }"
                        :max="question.options.map(val => val.option).length - 1"
                        :model-value="question.answer"
                        @update:model-value="handleUpdate($event, question)"
                        step="1"
                        class="mt-6"
                        track-size="8"
                        show-ticks="always"
                        tick-size="3"
                        thumb-label="always"
                      >
                        <template #thumb-label="{ modelValue }">
                          {{ modelValue }}
                        </template>
                      </VSlider>
                    </template>
                    <template v-if="question.type == 'table/subquestions'">
                      <template v-if="question.options.type == 'table-2col-3year-list-upload'">
                        <VTable>
                          <thead v-if="question.options.title">
                            <tr>
                              <th colspan="2">{{ question.options.title }}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="(answer, year) in question.answer" :key="year">
                              <template v-for="(a, fieldIndex) in answer" :key="fieldIndex">
                                <tr>
                                  <td style="width: 40%">{{ a.key }}</td>
                                  <td class="custom__text-field-in-table pt-2 pb-3">
                                    <template v-if="fieldIndex == 1">
                                      <div>
                                        <VFileInput
                                          accept=".xlsx,.xls,image/*,.doc,.docx,.csv,.pdf"
                                          label="File input"
                                          :error-messages="a?.error" :model-value="a.answer"
                                          @update:model-value="handleFile($event, a)"
                                          @click:clear="a.answer = null"
                                        ></VFileInput>
                                      </div>
                                      <div class="mt-2" v-if="a.answer_media">
                                        <template v-if="a.answer_media.constructor === Array">
                                          <template v-for="item in a?.answer_media" :key="item">
                                            <VRow no-gutters>
                                              <VCol cols="auto">
                                                <a :href="item['original_url']" target="_blank" rel="noopener noreferrer"> 
                                                  * {{ item['file_name'] }}  
                                                </a>
                                              </VCol>
                                              <VCol cols="auto">
                                                <VTooltip text="Remove file">
                                                  <template #activator="{ props }">
                                                    <VBtn v-bind="props" size="small" variant="plain" class="text-error" @click="a.answer_media = null"> <VIcon icon="mdi-trash"></VIcon> </VBtn>
                                                  </template>
                                                </VTooltip>
                                              </VCol>
                                            </VRow>
                                          </template>
                                        </template>
                                      </div>
                                    </template>
                                    <template v-else>
                                      <VTextField 
                                        v-model="a.answer" 
                                        @blur="a.answer = charLimit($event.target.value)"
                                        :hide-details="a.answer && a.answer.length == 255 ? false : true"
                                        :messages="[a.answer && a.answer.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                                      ></VTextField>
                                    </template>
                                  </td>
                                </tr>
                              </template>
                            </template>
                          </tbody>
                        </VTable>
                      </template>

                      <template v-if="question.options.type == 'table-2col-3year-list'">
                        <VTable>
                          <thead v-if="question.options.title">
                            <tr>
                              <th colspan="2">{{ question.options.title }}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="(answer, year) in question.answer" :key="year">
                              <template v-for="(a, fieldIndex) in answer" :key="fieldIndex">
                                <tr>
                                  <td style="width: 40%">{{ a.key }}</td>
                                  <td class="custom__text-field-in-table pt-2 pb-3">
                                    <VTextField 
                                      v-model="a.answer" 
                                      @blur="a.answer = charLimit($event.target.value)"
                                      :hide-details="a.answer && a.answer.length == 255 ? false : true"
                                      :messages="[a.answer && a.answer.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                                    ></VTextField>
                                  </td>
                                </tr>
                              </template>
                            </template>
                          </tbody>
                        </VTable>
                      </template>
                      <template v-if="question.options.type == 'table-yes-no-textfield'">
                        <VTable>
                          <thead>
                            <tr>
                              <th rowspan="2">
                                <span v-if="question.options.field_header">{{ question.options.field_header }}</span>
                              </th>
                              <th colspan="3">
                                <span v-if="question.options.title">{{ question.options.title== 'Is the organisation / partner First Nations owned and led'?'Is the initiative / organisation First Nations owned and led':question.options.title }} </span>
                              </th>
                            </tr>
                            <tr>
                              <th class="text-center">Yes</th>
                              <th class="text-center">No</th>
                              <th class="text-center">Unsure</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="(answer, answerIndex) in question.answer" :key="answer">
                              <tr>
                                <td style="width: 50%" class="py-2">
                                  <VTextField
                                    v-model="answer.value" 
                                    @blur="answer.value = charLimit($event.target.value)"
                                    :hide-details="answer.value && answer.value.length == 255 ? false : true"
                                    :messages="[answer.value && answer.value.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                                  ></VTextField>
                                </td>
                                <td>
                                  <VRow no-gutters justify="center">
                                    <VCol cols="auto">
                                      <VRadioGroup v-model="answer.yes_no">
                                        <VRadio class="m-0 p-0" value="Yes" style="margin-inline-start: unset"></VRadio>
                                      </VRadioGroup>
                                    </VCol>
                                  </VRow>
                                </td>
                                <td>
                                  <VRow no-gutters justify="center">
                                    <VCol cols="auto">
                                      <VRadioGroup v-model="answer.yes_no">
                                        <VRadio class="m-0 p-0" value="No" style="margin-inline-start: unset"></VRadio>
                                      </VRadioGroup>
                                    </VCol>
                                  </VRow>
                                </td>
                                <td>
                                  <VRow no-gutters justify="center">
                                    <VCol cols="auto">
                                      <VRadioGroup v-model="answer.yes_no">
                                        <VRadio class="m-0 p-0" value="Unsure" style="margin-inline-start: unset"></VRadio>
                                      </VRadioGroup>
                                    </VCol>
                                  </VRow>
                                </td>
                                <td>
                                  <VBtn v-if="answerIndex > 4" prepend-icon="mdi-delete" color="red" variant="plain" @click="question.answer.splice(answerIndex, 1)"></VBtn>
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </VTable>
                        <VRow justify="center">
                          <VCol cols="auto">
                            <VBtn v-if="question.options['allow-add-more']" @click="question.answer.push({yes_no: null, value: null})">Add more</VBtn>
                          </VCol>
                        </VRow>
                      </template>
                      <template v-if="question.options.type == 'label-textfield'">
                        <template v-for="field in question.answer" :key="field">
                          <VTextField 
                            :label="field.label" 
                            v-model="field.value" 
                            class="mb-4"  
                            @blur="field.value = charLimit($event.target.value)"
                            :hide-details="field.value && field.value.length == 255 ? false : true"
                            :messages="[field.value && field.value.length == 255 ? 'Limit reached: maximum of 255 characters' : null]"
                          >
                          </VTextField>
                        </template>
                      </template>
                    </template>

                    <template v-if="question.type == 'multi choice, textarea'">
                      <VRadioGroup :model-value="question.answer" @update:model-value="handleUpdate($event, question)">
                        <VRadio
                          v-for="option in question.options"
                          :label="option.option"
                          :key="option"
                          :value="option.option"
                        ></VRadio>
                      </VRadioGroup>
                      <VTextarea v-if="question.answer == 'Other (please state)' || question.answer == 'Other (please specify)'" v-model="question.others"></VTextarea>
                    </template>
                  </VCardText>
                </VCard>
              </template>
            </VCol>
          </VRow>
        </template>
      </TransitionGroup>

      
      <VDialog v-model="saveExitSuccessFull" max-width="700" persistent>
        <VCard class="auth-card pa-4">
          <VCardText class="pt-2">
            <h3 class="text-h6 font-weight-semibold mb-1 text-center">This questionnaire has been saved. An email with a link to complete the survey has been sent to your inbox.</h3>
          </VCardText>
        </VCard>
      </VDialog>
      <VDialog v-model="saveExitModal" max-width="700" persistent>
        <VCard class="auth-card pa-4">
          <VCardText class="pt-2">
            <VBtn
              v-if="!saveExitForm.processing"
              icon size="x-medium" color="default" variant="text" class="float-end"
              @click.prevent="saveExitModal = false"
            >
              <VIcon size="x-large" icon="tabler-x" color="primary" />
            </VBtn>
            <h3 class="text-h5 font-weight-semibold mb-1">Save and Exit</h3>
          </VCardText>
          <VCardText>
            <VForm> 
              <VTextField 
                class="mb-4" 
                label="First Name *" 
                v-model="saveExitForm.first_name"
                :error="saveExitForm.errors.first_name ? true : false"
                :error-messages="saveExitForm.errors.first_name"
                @update:model-value="saveExitForm.clearErrors('first_name')"
              /> 
              <VTextField 
                class="mb-4" 
                label="Last Name *" 
                v-model="saveExitForm.last_name"
                :error="saveExitForm.errors.last_name ? true : false"
                :error-messages="saveExitForm.errors.last_name"
                @update:model-value="saveExitForm.clearErrors('last_name')"
              /> 
              <VTextField 
                class="mb-4" 
                label="Email *" 
                v-model="saveExitForm.email"
                :error="saveExitForm.errors.email ? true : false"
                :error-messages="saveExitForm.errors.email"
                @update:model-value="saveExitForm.clearErrors('email')"
              /> 
            </VForm>
          </VCardText>
          <VCardText>
            <VRow justify="end">
              <VCol cols="auto">
                <VBtn class="mt-2" :disabled="saveExitForm.processing" @click="saveExit">SUBMIT</VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VDialog>
      

      <VRow justify="center">
        <VCol cols="12" xl="6" lg="9" md="12">
          <VRow justify="center">
            <VCol cols="auto" order-lg="0">
              <VBtn @click="initialPage -= 1" :disabled="initialPage == 0 ? true : false">
                <VIcon icon="mdi-arrow-left" size="small" class="mr-1" v-if="!initialPage == 0"></VIcon>
                Back
              </VBtn>
            </VCol>
            <VCol
              md="auto" lg="auto" xl="auto" cols="10" class="ml-lg-auto ml-md-auto ml-xl-auto"
              order="3" order-md="2" order-lg="2"
            >
              <VRow no-gutters justify="center">
                <VBtn @click="saveExitModal = !saveExitModal" class="mr-2">
                  <VIcon icon="mdi-content-save" size="small" class="mr-1"></VIcon>
                  Save and Exit
                </VBtn>
              </VRow>
            </VCol>
            <VCol cols="auto" order="2" order-md="3" order-lg="3" v-if="initialPage + 1 != questions.length">
              <VBtn @click="initialPage += 1">
                Next
                <VIcon icon="mdi-arrow-right" size="small" class="ml-1"></VIcon>
              </VBtn>
            </VCol>
            <VCol cols="auto" order="2" order-md="3" order-lg="3" v-if="initialPage + 1 == questions.length">
              <VBtn @click="submit">
                Submit
              </VBtn>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VApp>
</template>

<style>
.v-slider-track__tick-label {
    font-size: 0.80rem;
}
</style>

<style scoped lang="scss">
.position {
  position: absolute;
}
.v-card-text {
  padding: 20px;
}
// .v-container {
//   @media (min-width: 1920px){
//     max-width: 1350px;
//     padding: 43px;
//   }
// }
// .v-container {
//   @media (min-width: 960px){
//     max-width: 1350px;
//     padding: 43px;
//   }
// }
.v-progress-linear__background {
  border-radius: 20px !important;
}
@media (max-width: 960px) {
    .custom__questions-label {
        font-size: 12px !important;
        margin-bottom: 5px !important;
    }
    .custom__text-field-in-table {
      width: 100% !important
    }
}
</style>
