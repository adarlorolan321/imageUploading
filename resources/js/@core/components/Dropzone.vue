<script setup>
import { reactive, watch } from "vue";
import { useDropzone } from "vue3-dropzone";

const props = defineProps({
  multiple: Boolean,
  accept: String,
  setFiles: Function,
});

const state = reactive({
  files: [],
});

const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({
  onDrop,
});

watch(state, () => {
  props.setFiles(state.files)
});

watch(isDragActive, () => {
  console.log("isDragActive", isDragActive.value, rest);
});

function onDrop(acceptFiles, rejectReasons) {
  const files = acceptFiles.map((file) =>
    Object.assign(file, {
      preview: URL.createObjectURL(file),
    }),
  );

  state.files = [...state.files, ...files];
}

function handleClickDeleteFile(e, index) {
  state.files.splice(index, 1);
  e.preventDefault();
}

const iProps = getInputProps();

iProps.accept = props.accept || "*";
</script>

<template>
  <div>
    <!--
 <div v-if="state.files.length > 0" class="files">
      <div class="file-item" v-for="(file, index) in state.files" :key="index">
        <span>{{ file.name }}</span>
        <span class="delete-file" @click="handleClickDeleteFile(index)"
          >Delete</span
        >
      </div>
    </div> 
-->
    <div class="dropzone">
      <VRow>
        <VCol
          class="text-center"
          md="3"
          :key="index"
          v-for="(file, index) in state.files"
        >
          <div v-if="file.type.includes('image')">
            <img :src="file.preview" width="120" height="160" />
            <div class="dz-filename">{{ file.name }}</div>
            <div class="">{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</div>
          </div>
          <div v-else>
            <VIcon
              class="file-icon"
              icon="tabler-file-import"
              width="120"
              height="160"
            />
          </div>
          <VBtn
            size="x-small"
            color="error"
            @click="(e) => handleClickDeleteFile(e, index)"
          >
            Delete
          </VBtn>
        </VCol>
      </VRow>
      <VRow v-bind="getRootProps()" v-if="multiple || (!multiple && state.files.length == 0)">
        <VCol>
          <div class="relative">
            <div
              class="cursor"
              :class="{
                isDragActive,
              }"
            >
              <input
                v-bind="iProps"
                :accept="accept"
              />
              <div>
                <p v-if="isDragActive" class="dz-message">
                  Drop the files here ...
                </p>
                <p v-else class="dz-message">
                  Drop files here or click to upload
                </p>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.relative {
  position: relative;
}

.dropzone,
.files {
  border: 2px dashed #dbdade;
  min-height: 300px;
}

.dz-message {
  color: #5d596c;
  margin: 8rem 0 3rem;
  font-weight: 500;
  text-align: center;
  font-size: 1.625rem;
}

.dz-message:before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-upload' width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='%235d596c' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2' /%3E%3Cpolyline points='7 9 12 4 17 9' /%3E%3Cline x1='12' y1='4' x2='12' y2='16' /%3E%3C/svg%3E") !important;
  background: rgba(75, 70, 92, 0.08);
}

.dz-message:before {
  content: "";
  border-radius: 8px;
  position: absolute;
  top: -4rem;
  left: calc(50% - 22px);
  display: inline-block;
  height: 48px;
  width: 48px;
  background-repeat: no-repeat !important;
  background-position: center !important;
}
.dz-filename {
  width: 100%;
  overflow: hidden;
  padding: 0.625rem 0.625rem 0 0.625rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dropzone {
  width: 100%;
  position: relative;
  padding: 1.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
}

.dz-details {
  width: 100%;
}

.file-icon {
  width: 120px;
  height: 160px;
}
</style>
