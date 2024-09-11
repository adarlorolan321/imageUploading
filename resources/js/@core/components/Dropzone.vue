<script setup>
import { useDropZone, useFileDialog, useObjectUrl } from "@vueuse/core";

const dropZoneRef = ref();
const { open, files } = useFileDialog({ accept: "image/*" });

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "closeModal", "clearData"]);

const fileData = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
  },
});

const errorMessage = ref(null);

function onDrop(DroppedFiles) {
  DroppedFiles?.forEach((file) => {
    if (file.type.slice(0, 6) !== "image/") {
      errorMessage.value = "Invalid file type";
      return;
    }
    if (file.size > 1024 * 1024 * 10) {
      errorMessage.value = "File is too big";
      return;
    }
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? "",
    });
  });
}

const clearChanges = () => {
  fileData.value = fileData.value.filter((item) => item.id);
  emit("update:modelValue", fileData.value);
  emit("closeModal");
};

// Watch for file changes
watch(files, (selectedFiles) => {
  if (!selectedFiles) return;

  for (const file of selectedFiles) {
    if (file.type.slice(0, 6) !== "image/") {
      errorMessage.value = "Invalid file type";
      return;
    }
    if (file.size > 1024 * 1024 * 10) {
      errorMessage.value = "File is too big";
      return;
    }

    if (errorMessage.value) {
      errorMessage.value = null;
    }

    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? "",
    });
  }
  emit("update:modelValue", fileData.value);
});

useDropZone(dropZoneRef, onDrop);
</script>


<template>
  <div class="flex position-relative">
    <div class="w-full h-auto relative">
      <div ref="dropZoneRef" class="cursor-pointer" @click="() => open()">
        <div
          v-if="fileData.length <= 0"
          class="d-flex flex-column justify-center align-center gap-y-2 pa-12 drop-zone rounded"
        >
          <IconBtn variant="tonal" class="rounded-sm">
            <VIcon icon="tabler-upload" />
          </IconBtn>
          <h4 class="text-h4">Drag and drop your image here.</h4>
          <span class="text-disabled">or</span>

          <VBtn variant="tonal" size="small"> Browse Images </VBtn>
        </div>

        <div
          v-else
          class="d-flex justify-center align-center gap-3 pa-8 drop-zone flex-wrap"
        >
          <VRow class="match-height w-100 pt-10">
            <template v-for="(item, index) in fileData" :key="index">
              <VCol cols="12" sm="4">
                <VCard :ripple="false" border>
                  <VCardText class="d-flex flex-column" @click.stop>
                    <VImg
                      :src="item?.url ?? item.original_url"
                      width="200px"
                      height="150px"
                      class="w-100 mx-auto"
                    />
                    <div class="mt-2">
                      <span class="clamp-text text-wrap">
                        {{ item.file?.name ?? item.name }}
                      </span>
                      <span>
                        {{ item.file?.size ?? item.size / 1000 }} KB
                      </span>
                    </div>
                  </VCardText>
                  <VCardActions>
                    <VBtn
                      variant="text"
                      block
                      @click.stop="fileData.splice(index, 1)"
                    >
                      Remove File
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </template>

            <VCol cols="12" sm="4">
              <VCard :ripple="false" class="border-dotted d-flex">
                <VIcon icon="tabler-plus" size="60" class="mx-auto my-auto" />
              </VCard>
            </VCol>
          </VRow>
        </div>
        <span class="text-error fs-13 ms-7">{{ errorMessage }}</span>
      </div>
      <slot name="caption" />
    
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 1px dashed rgba(var(--v-theme-on-surface), var(--v-border-opacity));
}

.close-btn {
  top: 10px;
  right: 10px;
  z-index: 9;
}
.error-message {
  color: red;
}
.border-dotted {
  border: 3px dotted rgba(var(--v-theme-on-surface), var(--v-border-opacity));
}
</style>
